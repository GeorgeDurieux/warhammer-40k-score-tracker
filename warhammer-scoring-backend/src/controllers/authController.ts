import { Request, Response } from "express"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key'

export const register = async (req: Request, res: Response): Promise<void> => {
    
    const { username, email, password } = req.body

    if (!username || !email || !password) {
        res.status(400).json({ err: 'All fields are required' })
        return
    }

    try {
        const existingUser = await prisma.users.findFirst({
            where: { OR: [{ email }, { username }]}
        })

        if (existingUser) {
            res.status(409).json({ err: 'User already exists' })
            return
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = await prisma.users.create({
            data: {
                username,
                email,
                password: hashedPassword
            }
        })

        const token = jwt.sign({ id: newUser.id, username: newUser.username, email: newUser.email }, JWT_SECRET, { expiresIn: '7d' })

        res.status(201).json({ token, user: { id: newUser.id, username: newUser.username }})

    } catch( err) {
        console.log(err)
        res.status(500).json( { err: 'Failed to register user' })
    }
}

export const login = async (req: Request, res: Response): Promise<void> => {

    const { username, password } = req.body

    if (!username || !password) {
        res.status(400).json({ err: 'Email and password are required' })
        return
    }

    try {
        const user = await prisma.users.findUnique({
            where: { username }
        })

        if (!user) {
            res.status(401).json( { err: 'Invalid username' })
            return
        }

        const isValid = await bcrypt.compare(password, user.password)

        if (!isValid) {
            res.status(401).json( { err: 'Invalid password' })
            return
        }

        const token = jwt.sign({ id: user.id, username: user.username, email: user.email }, JWT_SECRET, { expiresIn: '7d'})

        res.status(200).json({ token, user: { id: user.id, username: user.username } })

    } catch(err) {
        console.log(err)
        res.status(500).json({ err: 'Failed to login' })
    }
}
