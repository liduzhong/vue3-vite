import { fileURLToPath, URL } from 'node:url'
import AutoImport from 'unplugin-auto-import/vite'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
const path = require('path')
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      imports: ['vue', 'vue-router'],
      dts: 'src/auto-imports.d.ts',
      // dirs: ['./src/api', './src/utils'],
    }), 
    createSvgIconsPlugin({
      // 指定需要缓存的图标文件夹
      iconDirs: [path.resolve(process.cwd(), 'src/icons')],
      // 指定symbolId格式
      symbolId: 'icon-[dir]-[name]',
    }),
    vueJsx(),

  ],
  resolve: {
    alias: {
      // "@": path.resolve(__dirname, "src"),
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'vue': 'vue/dist/vue.esm-bundler.js'
    }
  },
  esbuild: {
    jsxFactory: 'h', // 更改默认的 JSX 工厂函数 h() 为 Vue 3 中的 createVNode()
    jsxFragment: 'Fragment', // 更改默认的 JSX Fragments 名称为首字母大写的 Fragment
  },
  server: {
    // Listening on all local IPs
    host: true,
    port: 8080,
    // Load proxy configuration from .env
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
    },
  },
})
