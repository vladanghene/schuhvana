const fs = require('fs');
const path = require('path');
const { defineConfig } = require('@vue/cli-service');
const dotenv = require('dotenv');

// Load environment files in order of precedence
const defaultEnv = dotenv.config({ path: '.env' }).parsed || {};
const devEnv = dotenv.config({ path: '.env.development' }).parsed || {};
const localEnv = dotenv.config({ path: '.env.local' }).parsed || {};

// Merge them with later files taking precedence
const envVars = { ...defaultEnv, ...devEnv, ...localEnv };

module.exports = defineConfig({
  devServer: {
    https: {
      key: fs.readFileSync(path.join(__dirname, envVars.VUE_APP_SSL_KEY)),
      cert: fs.readFileSync(path.join(__dirname, envVars.VUE_APP_SSL_CERT)),
    },
    port: 8081,
    host: 'localhost',
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      }
    }
  }
});