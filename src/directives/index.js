import { getCamelCase } from '@/utils/tools'

const ctx = require.context('./', true, /(?!\.).(\/index\.js)$/)

const directives = ctx.keys().reduce((res, key) => {
  res[getCamelCase(key.match(/(?<=\.\/).*?(?=\/)/)[0])] = ctx(key).default
  return res
}, {})

export default {
  install (Vue) {
    Object.keys(directives).forEach(key => Vue.directive(key, directives[key]))
  }
}
