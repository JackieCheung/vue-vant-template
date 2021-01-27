'use strict'
const path = require('path')

function resolve (dir) {
  return path.join(__dirname, dir)
}

const autoprefixer = require('autoprefixer')
const pxToViewport = require('postcss-px-to-viewport')

const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')

const name = process.env.VUE_APP_TITLE || 'Vue Vant Template' // page title

// If your port is set to 80,
// use administrator privileges to execute the command line.
// For example, Mac: sudo npm run
// You can change the port by the following method:
// port = 9527 npm run dev OR npm run dev --port = 9527
const port = process.env.port || process.env.npm_config_port || 9527 // dev port

// // key: package name
// // value: global variable name
// // key是import的包名，value是CDN提供的全局变量名
// // 所以最后webpack会把一个静态资源编译成：module.export[key] = window[value]
// const externals = {
//   vue: 'Vue',
//   'vue-router': 'VueRouter',
//   vuex: 'Vuex',
//   vant: 'vant',
//   axios: 'axios'
// }
// // cdn
// const cdn = {
//   // 开发环境
//   dev: {
//     css: [],
//     js: ['https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/7.4.4/polyfill.js']
//   },
//   // 生产环境
//   build: {
//     css: [
//       'https://cdn.jsdelivr.net/npm/vant@beta/lib/index.css'
//     ],
//     js: [
//       'https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/7.4.4/polyfill.js',
//       'https://cdnjs.cloudflare.com/ajax/libs/vue/2.6.10/vue.min.js',
//       'https://cdnjs.cloudflare.com/ajax/libs/vue-router/3.1.2/vue-router.min.js',
//       'https://cdnjs.cloudflare.com/ajax/libs/axios/0.19.0/axios.min.js',
//       'https://cdnjs.cloudflare.com/ajax/libs/vuex/3.1.1/vuex.min.js',
//       'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.9-1/crypto-js.min.js',
//       'https://cdn.jsdelivr.net/npm/vant@beta/lib/vant.min.js'
//     ]
//   }
// }

// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {
  /**
   * You will need to set publicPath if you plan to deploy your site under a sub path,
   * for example GitHub Pages. If you plan to deploy your site to https://foo.github.io/bar/,
   * then publicPath should be set to "/bar/".
   * In most cases please use '/' !!!
   * Detail: https://cli.vuejs.org/config/#publicpath
   */
  publicPath: process.env.VUE_APP_PUBLIC_PATH,
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  devServer: {
    port: port,
    open: false, // Whether to automatically open the browser when the project starts OR Set by npm command parameter --open
    overlay: {
      warnings: false,
      errors: true
    },
    disableHostCheck: true,
    proxy: {
      // change xxx-api/login => mock/login
      // detail: https://cli.vuejs.org/config/#devserver-proxy
      [process.env.VUE_APP_BASE_API]: {
        target: process.env.VUE_APP_PROXY_TARGET,
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API]: ''
        }
      }
    },
    before: require('./mock/mock-server.js')
  },
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          autoprefixer(),
          pxToViewport({
            viewportWidth: 375,
            // 该项仅在使用 Circle 组件时需要
            // 原因参见 https://github.com/youzan/vant/issues/1948
            selectorBlackList: ['van-circle__layer']
          })
        ]
      }
    }
  },
  configureWebpack: config => {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    config.name = name
    config.resolve.alias = {
      '@': resolve('src'),
      '_v': resolve('src/views'),
      '_c': resolve('src/components')
    }

    // 为生产环境修改配置...
    if (process.env.NODE_ENV === 'production') {
      // // externals 里的模块不打包
      // Object.assign(config, {
      //   externals: externals
      // })
    }
    // 为开发环境修改配置...
    if (process.env.NODE_ENV === 'development') {
      //
    }
  },
  chainWebpack (config) {
    // /**
    //  * 添加CDN参数到htmlWebpackPlugin配置中， 详见public/index.html 修改
    //  */
    // config.plugin('html').tap(args => {
    //   if (process.env.NODE_ENV === 'production') {
    //     args[0].cdn = cdn.build
    //   }
    //   if (process.env.NODE_ENV === 'development') {
    //     args[0].cdn = cdn.dev
    //   }
    //   return args
    // })

    // it can improve the speed of the first screen, it is recommended to turn on preload
    config.plugin('preload').tap(() => [
      {
        rel: 'preload',
        // to ignore runtime.js
        // https://github.com/vuejs/vue-cli/blob/dev/packages/@vue/cli-service/lib/config/app.js#L171
        fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
        include: 'initial'
      }
    ])

    // when there are many pages, it will cause too many meaningless requests
    config.plugins.delete('prefetch')

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

    // set preserveWhitespace
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true
        return options
      })
      .end()

    /**
     * preserveWhitespace Deprecated since vue@2.6
     * Recommend whitespace: 'condense', it is the default config in new vue-cli https://github.com/vuejs/vue-cli/pull/3853
     * Detail: https://github.com/vuejs/vue/issues/9208#issuecomment-450012518
     */

    // // use vue-cli default source-map
    // config
    //   // https://webpack.js.org/configuration/devtool/#development
    //   .when(process.env.NODE_ENV === 'development',
    //     // config => config.devtool('cheap-source-map')
    //     config => config.devtool('eval-source-map')
    //   )

    config
      .when(process.env.NODE_ENV !== 'development', config => {
        config
          .plugin('ScriptExtHtmlWebpackPlugin')
          .after('html')
          .use('script-ext-html-webpack-plugin', [{
            // `runtime` must same as runtimeChunk name. default is `runtime`
            inline: /runtime\..*\.js$/
          }])
          .end()
        config
          .optimization
          .splitChunks({
            chunks: 'all',
            cacheGroups: {
              libs: {
                name: 'chunk-libs',
                test: /[\\/]node_modules[\\/]/,
                priority: 10,
                chunks: 'initial' // only package third parties that are initially dependent
              },
              commons: {
                name: 'chunk-commons',
                test: resolve('src/components'), // can customize your rules
                minChunks: 3, //  minimum common number
                priority: 5,
                reuseExistingChunk: true
              }
            }
          })
        config.optimization.runtimeChunk('single')
      }
      )
    // 生产环境才开启，不然开发时lodash函数不起作用，也不报错
    if (process.env.NODE_ENV === 'production') {
      config.plugin('lodashModuleReplacement')
        .use(new LodashModuleReplacementPlugin())
      // // 开启 gzip 压缩
      // config.plugin('compressionPlugin')
      //   .use(new CompressionPlugin({
      //     algorithm: 'gzip',
      //     test: /\.(js|css|json|txt|html|ico|svg|bmp|woff|woff2|ttf)(\?.*)?$/i, // 所有匹配该正则的资源都会被处理，图片（png、gif、jpg、jpeg）不进行压缩，默认值是全部资源
      //     threshold: 1024 * 10, // 只有大小大于该值的资源会被处理，单位是 bytes，默认值是 0
      //     deleteOriginalAssets: false, // 是否删除原始资源，默认值是 false，若设置为 true，则 Nginx 的 gzip_static 静态压缩不会生效，需要 Nginx 配置在线压缩
      //     minRatio: 0.8 // 只有压缩率（压缩大小 ÷ 原始大小）小于该值的资源才会被处理，默认值是 0.8
      //   }))
    }
  }
}
