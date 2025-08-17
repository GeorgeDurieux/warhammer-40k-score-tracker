type LogLevel = 'error'

interface LogPayload {
    level: LogLevel
    message: string
    username?: string
    metadata?: Record<string, any>
}

export const logError = async (message: string, metadata?: Record<string, any>) => {
    try {
        const payload: LogPayload = {
            level: 'error',
            message,
            metadata
        }

        await fetch('/logs/frontend', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })

    } catch (err) {
        console.error('Failed to send log:', err)
    }
}
