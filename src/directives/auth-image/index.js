/**
 * @description: 自定义指令，允许img标签的src可以访问受保护的路径
 * @author: Jackie
 * @date: 2019/10/21 16:04
 */
import authImage from './auth-image'

const install = function (Vue) {
  Vue.directive('auth-image', authImage)
}

if (window.Vue) {
  window['auth-image'] = authImage
  Vue.use(install) // eslint-disable-line
}

authImage.install = install
export default authImage
