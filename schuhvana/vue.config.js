module.exports = {
    devServer: {
      proxy: {
        '/api': {
          target: 'https://api.schuhvana.store',
          changeOrigin: true,
          secure: false,
          pathRewrite: { '^/api': '' },
        },
      },
      https: true,  // Enable HTTPS for local development
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