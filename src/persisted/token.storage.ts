import { DefaultCfg } from '@configs/env.config'

export class TokenStorage {
    private static readonly STORAGE_KEY = 'auth_token'
    private static readonly TOKEN_SECRET = DefaultCfg.token_secret

    private static encrypt(data: string): string {
        return btoa(data + this.TOKEN_SECRET)
    }

    private static decrypt(data: string) {
        try {
            const decoded = atob(data)

            return decoded.replace(this.TOKEN_SECRET, '')
        } catch (error) {
            return null
        }
    }

    public static set(token: string) {
        localStorage.setItem(this.STORAGE_KEY, this.encrypt(token))
    }

    public static get() {
        const encryptedToken = localStorage.getItem(this.STORAGE_KEY)

        return encryptedToken && this.decrypt(encryptedToken)
    }

    public static has() {
        return Boolean(this.get())
    }

    public static clear() {
        localStorage.removeItem(this.STORAGE_KEY)
    }
}
