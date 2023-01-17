import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    outDir: '.dist'
  },
  plugins: [vue()]
})
