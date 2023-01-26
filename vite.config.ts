import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path' // 找不到模块 npm i @types/node -D

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: [
      {
        find: '@', // 别名
        replacement: resolve(__dirname, 'src'), // 别名对应地址
      },
    ],
  },
})
