import { AxiosError } from 'axios'

export function processServerError(e: unknown, fallbackMessage = 'Request failed') {
    if (e instanceof AxiosError) {
        const errorData = e.response?.data

        if (typeof errorData === 'object' && errorData && 'message' in errorData) {
            alert(errorData.message)
        } else {
            alert(fallbackMessage)
        }
    } else {
        alert(fallbackMessage)
    }

    throw e
}
