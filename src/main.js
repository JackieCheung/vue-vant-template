import Vue from 'vue'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import '@/assets/css/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import '@/filters' // filters
import '@/permission' // permission 权限
import '@/vendor' // 统一 import 依赖

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

Vue.prototype.$eventHub = Vue.prototype.$eventHub || new Vue()

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
