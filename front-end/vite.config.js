import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

const fromRoot = (path) => fileURLToPath(new URL(path, import.meta.url))

export default defineConfig ({
    build: {
        rollupOptions: {
            input: {
                main: fromRoot('index.html'),
                map: fromRoot('src/map/map.html')
            }
        }
    },
    optimizeDeps:{
        exclude:['maplibre-gl']
    },
    plugins:[
        tailwindcss(),
    ]
})
