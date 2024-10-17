const fs = require('fs');
const path = require('path');
require('dotenv').config();  // Load environment variables

module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'https://api.schuhvana.store',
        changeOrigin: true,
        secure: false,  // Set to true if you want to verify the SSL cert
        pathRewrite: { '^/api': '' },
      },
    },
    https: {
      key: fs.readFileSync(path.join(__dirname, process.env.VUE_APP_SSL_KEY)),  // Read from .env
      cert: fs.readFileSync(path.join(__dirname, process.env.VUE_APP_SSL_CERT)),  // Read from .env
    },
    port: 8080,
    host: 'localhost',
    public: 'https://localhost:8080',  // Public URL for the dev server
  },
  css: {
    loaderOptions: {
      css: {
        // Pass options to css-loader
      },
      scss: {
        // Pass options to sass-loader
      },
    },
  },
};