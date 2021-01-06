import { getFinalStyle } from './tools'

/* collection of validations */

/**
 * @description validate whether is an valid url or not
 * @param { String } url
 * @returns { Boolean }
 */
export function validURL (url) {
  const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return reg.test(url)
}

/**
 * @description validate whether the letters of the string are all lower-case or not
 * @param { String } str
 * @returns { Boolean }
 */
export function validLowerCase (str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/**
 * @description validate whether the letters of the string are all upper-case or not
 * @param { String } str
 * @returns { Boolean }
 */
export function validUpperCase (str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/**
 * @description validate whether the letters of the string are all alphabet or not
 * @param { String } str
 * @returns { Boolean }
 */
export function validAlphabets (str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/**
 * @description validate whether is an valid email address or not
 * @param { String } email
 * @returns { Boolean }
 */
export function validEmail (email) {
  const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return reg.test(email)
}

/**
 * @description validate whether is an valid phone number or not
 * @param {String} phone
 * @returns { Boolean }
 */
export function validPhone (phone) {
  const reg = /^[1][3-9][0-9]{9}$/
  return reg.test(phone)
}

/**
 * @description determine whether is an external path or not
 * @param { String } path
 * @returns { Boolean }
 */
export function isExternal (path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @description determine whether is a string or not
 * @param { * } arg
 * @returns { Boolean }
 */
export function isString (arg) {
  return typeof arg === 'string' || arg instanceof String
}

/**
 * @description determine whether is an array or not
 * @param { * } arg
 * @returns { Boolean }
 */
export function isArray (arg) {
  if (typeof Array.isArray === 'undefined') {
    return Object.prototype.toString.call(arg) === '[object Array]'
  }
  return Array.isArray(arg)
}

/**
 * @description determine whether is an object or not
 * @param { * } arg
 * @returns { Boolean }
 */
export const isObject = (arg) => {
  return Object.prototype.toString.call(arg) === '[object Object]'
}

/**
 * @description 判断是否为函数
 * @param { * } arg
 * @returns { Boolean }
 */
export const isFunction = (arg) => {
  return Object.prototype.toString.call(arg) === '[object Function]'
}

/**
 * @description determine whether the current device type is Android
 * @returns { Boolean }
 */
export const isAndroidDevice = (() => {
  return window.navigator.userAgent.indexOf('Android') > -1 || window.navigator.userAgent.indexOf('Adr') > -1
})()

/**
 * @description determine whether the current device type is IOS
 * @returns { Boolean }
 */
export const isIOSDevice = (() => {
  return !!window.navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
})()

/**
 * @description determine whether the current device type is mobile
 * @returns { Boolean }
 */
export const isMobileDevice = (() => {
  // return 'ontouchstart' in window
  return !!window.navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
})()

/**
 * @description determine whether the browser environment of the current client is a WeChat browser
 * @returns { Boolean }
 */
export const isWechatBrowser = (() => {
  return window.navigator.userAgent.toLowerCase().includes('micromessenger')
})()

/**
 * @description determine whether the browser environment of the current client is Alipay browser
 * @returns { Boolean }
 */
export const isAlipayBrowser = (() => {
  return window.navigator.userAgent.toLowerCase().includes('alipayclient')
})()

/**
 * @description 用户名是不少于6位的字母和数字组合
 * @param { String } username 用户名
 * @returns { Boolean }
 */
export function validUsername (username) {
  return /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,}$/.test(username)
}

/**
 * @description 密码不能少于6位
 * @param { String } password 密码
 * @returns { Boolean }
 */
export function validPassword (password) {
  return password.length >= 6
}

/**
 * @description 判断元素内部的滚动条是否滚动到元素底部
 * @param { HTMLElement } element
 * @returns { Boolean }
 * @author Jackie
 * @date 2020-03-20 08:22
 */
export function isScrolledToBottom (element) {
  const scrollTop = element && element.scrollTop || 0
  const clientHeight = element && element.clientHeight || 0
  const scrollHeight = element && element.scrollHeight || 0
  return getFinalStyle(element, 'overflow-y') === 'hidden' || scrollHeight <= clientHeight || Math.ceil(scrollTop) + clientHeight >= scrollHeight
}

/**
 * @description 验证身份证号码是否合法
 * @param { String } idCardNo
 * @returns { Boolean }
 * @author Jackie
 * @date 2020-03-23 16:40
 */
export function validIdCard (idCardNo) {
  return /(^\d{8}(0\d|10|11|12)([0-2]\d|30|31)\d{3}$)|(^\d{6}(18|19|20)\d{2}(0\d|10|11|12)([0-2]\d|30|31)\d{3}[\dXx]$)/.test(idCardNo)
}

/**
 * @description 验证护照是否合法
 * @param { String } passport
 * @returns { Boolean }
 * @author Jackie
 * @date 2020-06-02 17:20
 */
export const validPassport = (passport) => {
  return /(^[a-zA-Z]{5,17}$)|(^[a-zA-Z0-9]{5,17}$)/.test(passport)
}

/**
 * @description 验证港澳通行证是否合法
 * @param { String } HKMacaoPass
 * @returns { Boolean }
 * @author Jackie
 * @date 2020-06-02 17:20
 */
export const validHKMacaoPass = (HKMacaoPass) => {
  return /^[HMhm]{1}([0-9]{10}|[0-9]{8})$/.test(HKMacaoPass)
}

/**
 * @description 验证台湾通行证是否合法
 * @param { String } TaiwanPass
 * @returns { Boolean }
 * @author Jackie
 * @date 2020-06-02 17:20
 */
export const validTaiwanPass = (TaiwanPass) => {
  return /^[0-9]{8}$|^[0-9]{10}$/.test(TaiwanPass)
}

/**
 * @description 判断是否为空
 * @param { * } val
 * @returns { Boolean }
 */
export const isEmpty = (val) => {
  // null or undefined
  if (val == null) return true

  if (typeof val === 'boolean') return false

  if (typeof val === 'number') return !val

  if (val instanceof Error) return val.message === ''

  switch (Object.prototype.toString.call(val)) {
    // String or Array
    case '[object String]':
    case '[object Array]':
      return !val.length

    // Map or Set or File
    case '[object File]':
    case '[object Map]':
    case '[object Set]': {
      return !val.size
    }
    // Plain Object
    case '[object Object]': {
      return !Object.keys(val).length
    }
  }

  return false
}

/**
 * @description 判断图片地址是否有效
 * @param { String } url 图片地址
 * @returns { Promise }
 * @author Jackie
 * @date 2020-04-03 08:17
 */
export const validImage = (url) => {
  return new Promise(resolve => {
    const image = new Image()
    image.onload = () => resolve(image.width > 0 && image.height > 0)
    image.onerror = () => resolve(false)
    image.crossOrigin = 'anonymous'
    image.src = url
  })
}

/**
 * @description 验证输入的金额是否合法
 * @param { String } val
 * @returns { Boolean }
 * @author Jackie
 * @date 2020-05-16 11:05
 */
export const validAmount = (val) => {
  return /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/.test(val)
}
