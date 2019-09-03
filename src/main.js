import Vue from 'vue'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import '@/assets/css/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import '@/filters' // filters
import '@/permission' // permission 权限

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
// use font-awesome icon
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon, FontAwesomeLayers, FontAwesomeLayersText }
  from '@fortawesome/vue-fontawesome'

library.add(fas, far, fab)

Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.component('font-awesome-layers', FontAwesomeLayers)
Vue.component('font-awesome-layers-text', FontAwesomeLayersText)

/* 解决移动端 300ms 延迟的问题 */
import FastClick from 'fastclick'

FastClick.attach(document.body)

/**
 * detail
 * @see https://github.com/ftlabs/fastclick/issues/358
 */
FastClick.prototype.focus = function (targetElement) {
  const deviceIsWindowsPhone = navigator.userAgent.indexOf('Windows Phone') >= 0
  const deviceIsIOS = /iP(ad|hone|od)/.test(navigator.userAgent) && !deviceIsWindowsPhone
  let length
  let useSelectionRange = deviceIsIOS
  if (useSelectionRange) {
    try {
      length = targetElement.value.length
      targetElement.focus()
      targetElement.setSelectionRange(length, length)
    } catch (error) {
      useSelectionRange = false
    }
  }
  if (!useSelectionRange) {
    targetElement.focus()
  }
}

// FastClick.prototype.focus = function (targetElement) {
//   let length
//   // Issue #160: on iOS 7, some input elements (e.g. date datetime month) throw a vague TypeError on setSelectionRange. These elements don't have an integer value for the selectionStart and selectionEnd properties, but unfortunately that can't be used for detection because accessing the properties also throws a TypeError. Just check the type instead. Filed as Apple bug #15122724.
//   if (targetElement.setSelectionRange && targetElement.type.indexOf('date') !== 0 && targetElement.type !== 'time' && targetElement.type !== 'month' && targetElement.type !== 'email' && targetElement.type !== 'number') {
//     length = targetElement.value.length
//     /* 修复 bug ios 11.3不弹出键盘，这里加上聚焦代码，让其强制聚焦弹出键盘 */
//     targetElement.focus()
//     targetElement.setSelectionRange(length, length)
//   } else {
//     targetElement.focus()
//   }
// }

Vue.config.productionTip = false

Vue.prototype.$eventHub = Vue.prototype.$eventHub || new Vue()

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
