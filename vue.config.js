const fs = require('fs');
const path = require('path');
const { defineConfig } = require('@vue/cli-service');
require('dotenv').config();

module.exports = defineConfig({
  devServer: {
    proxy: {
      '/api': {
        target: 'https://api.schuhvana.store',
        changeOrigin: true,
        secure: false,
        pathRewrite: { '^/api': '' },
      },
    },
    https: {
      key: fs.readFileSync(path.join(__dirname, process.env.VUE_APP_SSL_KEY)),
      cert: fs.readFileSync(path.join(__dirname, process.env.VUE_APP_SSL_CERT)),
    },
    port: 8081,
    host: 'localhost',
    allowedHosts: 'all',
  },
  transpileDependencies: true,
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      }
    }
  }
});