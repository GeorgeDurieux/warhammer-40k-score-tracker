import { ERROR_MESSAGES } from '../constants/errorMessages'

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
        return { title: 'Error', message: error }
    }

    const message = ERROR_MESSAGES[errorCode || ''] || "An unexpected error occurred."
    return { title: 'Error', message }
}

