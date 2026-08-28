import { fileURLToPath } from 'node:url'
import { mkdir, copyFile } from 'node:fs/promises'
import { dirname } from 'node:path'
import { createRequire } from 'node:module'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

const fromRoot = (path) => fileURLToPath(new URL(path, import.meta.url))

const require = createRequire(import.meta.url)

const copyMaplibreWorkers = () => {
  const maplibreDist = dirname(require.resolve('maplibre-gl/package.json')) + '/dist'
  const workers = [
    'maplibre-gl-worker.mjs',
    'maplibre-gl-shared.mjs'
  ]

  return {
    name: 'copy-maplibre-workers',
    apply: 'build',
    async closeBundle() {
      const outDir = 'dist/assets'
      await mkdir(outDir, { recursive: true })
      for (const file of workers) {
        await copyFile(`${maplibreDist}/${file}`, `${outDir}/${file}`)
      }
    }
  }
}

export default defineConfig ({
    build: {
        rollupOptions: {
            input: {
                main: fromRoot('index.html'),
                map: fromRoot('src/map/map.html')
            }
        },
        assetsDir: 'assets'
    },
    optimizeDeps:{
        exclude:['maplibre-gl']
    },
    plugins:[
        tailwindcss(),
        copyMaplibreWorkers()
    ]
})
