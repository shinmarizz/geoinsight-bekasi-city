import {defineConfig, rollupVersion} from 'vite'
import tailwindcss from '@tailwindcss/vite'
import {fileURLToPath} from "node:url"

export default defineConfig ({
    plugins:[
        tailwindcss(),
    ],
})