import axios from 'axios'
import { DefaultCfg } from '@configs/env.config'

class AuthService {
    public async login(data: { username: string; password: string }) {
        const response = await axios.post<{ token: string }>(`${DefaultCfg.server_base_url}/login`, data)

        return response.data
    }

    public async register(data: { username: string; password: string }) {
        const response = await axios.post<{ username: string }>(`${DefaultCfg.server_base_url}/register`, data)

        return response.data
    }
}

export const authService = new AuthService()
