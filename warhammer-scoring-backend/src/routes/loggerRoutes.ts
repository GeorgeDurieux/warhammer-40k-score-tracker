import { Router, Request, Response } from 'express'
import logger from '../logger/logger' 
import { authenticate } from '../middleware/authenticate'  

const router = Router()

router.post('/api/log/frontend', authenticate, (req: Request, res: Response) => {
    const { message, stack } = req.body
    const userId = (req as any).userId  

    if (!message) {
        res.status(400).json({ error: 'Message is required' })
        return
    }

    // Prefix log so we know it's from the frontend
    const logMessage = `[FRONTEND] User:${userId} - ${message}${stack ? `\nStack: ${stack}` : ''}`

    //Log
    try {
        logger.error(logMessage)
        res.status(200).json({ status: 'logged' })
    } catch (err) {
        console.error('Failed to log frontend error', err)
        res.status(500).json({ error: 'Logging failed' })
    }

    res.status(200).json({ status: 'logged' })
})


export default router
