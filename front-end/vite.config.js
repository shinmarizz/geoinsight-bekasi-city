import {defineConfig, rollupVersion} from 'vite'
import tailwindcss from '@tailwindcss/vite'
import {fileURLToPath} from "node:url"

export default defineConfig ({
    optimizeDeps:{
        exclude:['maplibre-gl']
    },
    plugins:[
        tailwindcss(),
    ]
})