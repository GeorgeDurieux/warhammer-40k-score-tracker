import { Request, Response } from "express"
import prisma from '../prisma'
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { ERROR_CODES } from '../constants/errorCodes'
import logger from '../logger/logger'  

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key'

export const register = async (req: Request, res: Response): Promise<void> => {
    const { username, email, password } = req.body
    logger.info(`[REGISTER] Attempting registration for username: ${username}, email: ${email}`)

    if (!username || !email || !password) {
        logger.warn('[REGISTER] Missing fields')
        res.status(400).json({ errorCode: ERROR_CODES.AUTH_MISSING_FIELDS })
        return
    }

    try {
        const existingUser = await prisma.users.findFirst({
            where: { OR: [{ email }, { username }] }
        })

        if (existingUser) {
            logger.warn(`[REGISTER] User already exists: ${username} / ${email}`)
            res.status(409).json({ errorCode: ERROR_CODES.AUTH_USER_EXISTS })
            return
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        logger.info('[REGISTER] Password hashed successfully')

        const newUser = await prisma.users.create({
            data: {
                username,
                email,
                password: hashedPassword
            }
        })
        logger.info(`[REGISTER] User created successfully: ${newUser.id}`)

        const token = jwt.sign(
            { id: newUser.id, username: newUser.username, email: newUser.email },
            JWT_SECRET,
            { expiresIn: '7d' }
        )
        logger.info(`[REGISTER] JWT token generated for user: ${newUser.id}`)

        res.status(201).json({ token, user: { id: newUser.id, username: newUser.username }})
    } catch(err) {
        logger.error('[REGISTER] Error occurred:', err)
        res.status(500).json({ errorCode: ERROR_CODES.AUTH_REGISTER_ERROR })
    }
}

export const login = async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body
    logger.info(`[LOGIN] Attempting login for username: ${username}`)

    if (!username || !password) {
        logger.warn('[LOGIN] Missing fields')
        res.status(400).json({ errorCode: ERROR_CODES.AUTH_MISSING_FIELDS })
        return
    }

    try {
        const user = await prisma.users.findUnique({
            where: { username }
        })

        if (!user) {
            logger.warn(`[LOGIN] Invalid username: ${username}`)
            res.status(401).json({ errorCode: ERROR_CODES.AUTH_INVALID_USERNAME })
            return
        }

        const isValid = await bcrypt.compare(password, user.password)
        if (!isValid) {
            logger.warn(`[LOGIN] Invalid password for username: ${username}`)
            res.status(401).json({ errorCode: ERROR_CODES.AUTH_INVALID_PASSWORD })
            return
        }

        const token = jwt.sign(
            { id: user.id, username: user.username, email: user.email, is_admin: user.is_admin },
            JWT_SECRET,
            { expiresIn: '7d' }
        )
        logger.info(`[LOGIN] JWT token generated for user: ${user.id}`)

        res.status(200).json({ token, user: { id: user.id, username: user.username } })
    } catch(err) {
        logger.error('[LOGIN] Error occurred:', err)
        res.status(500).json({ errorCode: ERROR_CODES.AUTH_LOGIN_ERROR })
    }
}
