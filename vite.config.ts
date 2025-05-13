import { defineConfig } from 'vite'
import { alias } from './vite.config.aliases'
import react from '@vitejs/plugin-react'

export default async () => {
    return defineConfig({
        optimizeDeps: {
            include: ['chart.js', 'react-chartjs-2'],
        },
        plugins: [react()],
        server: {
            host: 'localhost',
            cors: true,
            hmr: { protocol: 'ws' },
            port: 3000,
        },
        base: '/',
        resolve: { alias },
    })
}
