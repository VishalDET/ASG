import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        basicSsl()
    ],
    server: {
        proxy: {
            '/api': {
                target: 'https://srijayajewellery.in/asg/api',
                // target: 'https://localhost:44314/api/',

                changeOrigin: true,
                secure: false,
            }
        }
    }
})
