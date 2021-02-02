import Vue from 'vue'
import store from './store'
import router from './router'
import App from './App'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets
import './assets/styles/index.scss' // global css

import './router/auth' // permission control

import './assets/icons' // Svg Icon

import './vendors' // 统一 import 依赖

// registers customized directives
import directives from './directives'
Vue.use(directives)

// registers global utility filters
import * as filters from './filters'
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

/**
 * If you don't want to use mock-server
 * you want to use MockJS for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJS will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

// register an event hub
Vue.prototype.$eventHub = Vue.prototype.$eventHub || new Vue()

// register console.log
Vue.prototype.$log = Vue.prototype.$log || console.log

// assert
Window.prototype.assert = Window.prototype.assert || console.assert || function assert (condition, msg) {
  if (!condition) throw new Error(msg || 'Assert Error!')
}

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
