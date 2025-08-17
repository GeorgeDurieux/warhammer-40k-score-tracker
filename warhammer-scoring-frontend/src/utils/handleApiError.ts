import { ERROR_MESSAGES } from '../constants/errorMessages'
import { logError } from '../services/logger'

export const handleApiError = (error: any) => {
    let errorCode: string | undefined

    // Axios-style errors
    if (error.response?.data?.errorCode) {
        errorCode = error.response.data.errorCode
    } 
    // Fetch-style errors
    else if (error.errorCode) {
        errorCode = error.errorCode
    } 
    // Message errors etc
    else if (typeof error === 'string') {
        logError(error, undefined) 
        return { title: 'Error', message: error }
    }

    const message = ERROR_MESSAGES[errorCode || ''] || "An unexpected error occurred."

    logError(message, { errorCode }) 

    return { title: 'Error', message }
}

