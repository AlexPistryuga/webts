import axios from 'axios'
import { DefaultCfg } from '@configs/env.config'

class BackendService {
    public async login(data: { username: string; password: string }) {
        const response = await axios.post<{ token: string }>(`${DefaultCfg.server_base_url}/login`, data)

        return response.data
    }

    public async register(data: { username: string; password: string }) {
        const response = await axios.post<{ username: string }>(`${DefaultCfg.server_base_url}/register`, data)

        return response.data
    }

    public async updateEspState({
        mac,
        led_brightness,
        relay_state,
    }: {
        mac: string
        led_brightness: string
        relay_state: boolean
    }) {
        const query = `mac=${mac}&led_brightness=${led_brightness}&relay_state=${relay_state}`

        const res = await axios.get(`${DefaultCfg.server_base_url}/esp?${query}`)

        console.log('res', res.data)
    }
}

export const backendService = new BackendService()
