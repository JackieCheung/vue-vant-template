import Vue from 'vue'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import '@/assets/css/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import '@/filters' // filters
import '@/permission' // permission 权限

// 解决移动端click事件300毫秒延迟方法
import FastClick from 'fastclick'

if ('addEventListener' in document) {
  document.addEventListener(
    'DOMContentLoaded',
    function() {
      FastClick.attach(document.body)
    },
    false
  )
}

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */
// import { mockXHR } from '../mock'

// if (process.env.NODE_ENV !== 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
