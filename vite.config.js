import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { readdirSync } from 'fs'
import { join } from 'path'

function galleryPlugin() {
  const virtualId = 'virtual:gallery-counts'
  const resolvedId = '\0' + virtualId

  return {
    name: 'gallery-counts',
    resolveId(id) {
      if (id === virtualId) return resolvedId
    },
    load(id) {
      if (id !== resolvedId) return
      const categories = ['landscape', 'portrait', 'film', 'animal', 'abstract']
      const counts = {}
      for (const cat of categories) {
        try {
          counts[cat] = readdirSync(join(process.cwd(), 'public/images', cat, 'web')).filter(f =>
            /^\d+\.jpg$/i.test(f)
          ).length
        } catch {
          counts[cat] = 0
        }
      }
      return `export default ${JSON.stringify(counts)}`
    },
  }
}

export default defineConfig({
  plugins: [vue(), galleryPlugin()],
})
