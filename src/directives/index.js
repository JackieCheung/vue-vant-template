import { getCamelCase } from '@/utils/tools'

const ctx = require.context('./', true, /[^./index].*\/index\.js$/)

console.log(ctx.keys())

const directives = ctx.keys().reduce((res, key) => {
  res[getCamelCase(key.match(new RegExp('\\.\\/(\\S*)\\/'))[1])] = ctx(key).default
  return res
}, {})

export default {
  install (Vue) {
    Object.keys(directives).forEach(key => Vue.directive(key, directives[key]))
  }
}
