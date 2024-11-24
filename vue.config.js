const fs = require('fs');
const path = require('path');
const { defineConfig } = require('@vue/cli-service');
const dotenv = require('dotenv');

// Load both .env files
const defaultEnv = dotenv.config({ path: '.env' }).parsed || {};
const localEnv = dotenv.config({ path: '.env.local' }).parsed || {};

// Merge them with .env.local taking precedence
const envVars = { ...defaultEnv, ...localEnv };

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