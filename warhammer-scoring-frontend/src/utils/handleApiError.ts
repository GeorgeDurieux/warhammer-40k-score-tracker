import { ERROR_MESSAGES } from '../constants/errorMessages'

export const handleApiError = (error: any) => {

    const errorCode = error.response?.data?.errorCode

    const message = ERROR_MESSAGES[errorCode] || "An unexpected error occurred."

    alert(message)
}
