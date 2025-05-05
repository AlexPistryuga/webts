import { defineConfig } from 'vite'
import { alias } from './vite.config.aliases'
import react from '@vitejs/plugin-react'

export default async () => {
    return defineConfig({
        plugins: [react()],
        server: {
            host: 'localhost',
            cors: true,
            hmr: { protocol: 'ws' },
            port: 3000,
        },
        resolve: { alias },
    })
}
