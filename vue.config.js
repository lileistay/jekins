const name = process.env.VUE_APP_SYSTEM_NAME || '时光集团业务管理系统'
const CompressionPlugin = require("compression-webpack-plugin")
let { system } = require('./public/system');
let serverPath = ''
if (system == 'A') {
  serverPath = process.env.VUE_APP_BASE_REQUEST
} else {
  serverPath = process.env.VUE_APP_BASE_REQUESTB
}
// const serverPath = 'http://192.168.0.103:8088/'
const path = require('path')
function resolve(dir) {
  return path.join(__dirname, dir)
}
module.exports = {
  publicPath: '/',
  lintOnSave: false,
  devServer: {
    // host: '192.168.0.104',
    // host: '172.16.3.55',
    host: '0.0.0.0',
    disableHostCheck: true,
    port: '80',
    open: false,
    proxy: {
      '/api': {
        target: `${serverPath}`,
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },
  productionSourceMap: false,
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      config.mode = 'production'
      config['performance'] = {
        'maxEntrypointSize': 50000000,
        'maxAssetSize': 4000000,
        assetFilter: function (assetFilename) {
          return assetFilename.endsWith('.js')
        }
      }
    }
  },
  chainWebpack(config) {
    config.plugins.delete('preload') // TODO: need test
    config.plugins.delete('prefetch') // TODO: need test

    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/assets/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/assets/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()
    config.plugin('html')
      .tap(args => {
        args[0].title = name
        return args
      })
    if (process.env.NODE_ENV === 'production') {
      config.plugin('compressionPlugin').use(new CompressionPlugin({
        test: /\.(js|css|less|map)$/, // 匹配文件名
        threshold: 0, //压缩文件保持大小
        minRatio: 0.8,
        deleteOriginalAssets: true
      }))
    }
  }
}
