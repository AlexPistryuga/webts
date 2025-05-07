import { TokenStorage } from './token.storage'

interface ISignedUser {
    username: string
    iat: number
}

function base64UrlDecode(str: string): string {
    const base64 = str.replace(/-/g, '+').replace(/_/g, '/')

    const decoded = atob(base64)
    const splitted = decoded.split('')
    const mapped = splitted.map((c) => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)

    return decodeURIComponent(mapped.join(''))
}

export function getParsedJwt(): ISignedUser | undefined {
    const token = TokenStorage.get()

    const [_, payload] = (token || '').split('.')

    if (!payload) return

    try {
        return JSON.parse(base64UrlDecode(payload))
    } catch (e) {
        console.error(e)
        return
    }
}

export function getParsedJwtOrThrow(): ISignedUser {
    const parsedToken = getParsedJwt()

    if (!parsedToken) throw new Error('Parsing failed with status code E5001')

    return parsedToken
}
