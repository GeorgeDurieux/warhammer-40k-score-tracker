import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"


const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key'

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {

    const authHeader = req.headers.authorization 

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Unauthorized' })
        return
    }

    const token = authHeader.split(' ')[1]

    try {
        const payload = jwt.verify(token, JWT_SECRET) as { userId: number }
        (req as any).userId = payload.userId
        next()
    } catch (err) {
        res.status(401).json({ err: 'Invalid token' })
    }
}