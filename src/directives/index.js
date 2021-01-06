import authImage from '@/directives/auth-image'

const directives = {
  authImage
}

export default {
  install (Vue) {
    Object.keys(directives).forEach(key => Vue.directive(key, directives[key]))
  }
}
