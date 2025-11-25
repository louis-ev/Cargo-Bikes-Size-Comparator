import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueDevTools from 'vite-plugin-vue-devtools'
import { imagetools } from 'vite-imagetools'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), VueDevTools(), imagetools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  base: '',
  server: {
    port: Number(process.env.PORT) || 5174,
    strictPort: false
  },
  css: {
    preprocessorOptions: {
      scss: {
        // Ensure we're using the modern Sass API
        api: 'modern-compiler'
      }
    }
  }
})
