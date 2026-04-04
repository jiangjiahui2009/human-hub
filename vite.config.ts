import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // 把 lucide 图标相关的 chunk 合并到一个独立 vendor chunk
          // 防止图标被拆成单独 chunk 导致循环依赖
          if (id.includes('node_modules/lucide')) {
            return 'lucide-vendor'
          }
        },
      },
    },
  },
})
