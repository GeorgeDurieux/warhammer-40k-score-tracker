import { useAuth } from "../context/AuthContext"

type LogLevel = 'error'

interface LogPayload {
    level: LogLevel
    message: string
    username?: string
    metadata?: Record<string, any>
}

export const useLogger = () => {
    const { user } = useAuth()

    const log = async (level: LogLevel, message: string, metadata?: Record<string, any>) => {
        try {
            const payload: LogPayload = {
                level,
                message,
                username: user?.username,
                metadata
            }

            await fetch('/logs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })
        } catch (err) {
            console.error('Failed to send log:', err)
        }
    }

    const error = (message: string, metadata?: Record<string, any>) => log('error', message, metadata)

    return { error }
}
