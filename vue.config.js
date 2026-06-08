const { defineConfig } = require('@vue/cli-service')
const path = require('path')

// 后端 dev 地址(可被环境变量覆盖)
const BACKEND_TARGET = process.env.VUE_APP_BACKEND || 'http://localhost:8080'

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: './',
  outputDir: 'dist',
  productionSourceMap: false,
  devServer: {
    port: 8081,
    open: false,
    // 把 /api 代理到后端,避免跨域与联调成本
    proxy: {
      '/api': {
        target: BACKEND_TARGET,
        changeOrigin: true,
        ws: true,
        logLevel: 'warn'
      }
    }
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    }
  }
})
