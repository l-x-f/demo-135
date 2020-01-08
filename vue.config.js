'use strict'
module.exports = {
  publicPath: './',
  outputDir: 'dist',
  assetsDir: 'static',
  productionSourceMap: false,
  lintOnSave: true,
  devServer: {
    port: 8080,
    open: true,
    overlay: {
      warnings: true,
      errors: true
    }
  }
}
