/**
 * @description get page title
 * @param { String } pageTitle
 * @returns { String } page title
 */
export function getPageTitle (pageTitle) {
  const title = process.env.VUE_APP_TITLE || 'Vue Element Template'
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}

/**
 * @description parse the time to string
 * @param { Object | String | Number } time
 * @param { String } cFormat
 * @returns { String | null }
 */
export function parseTime (time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (typeof time === 'string') {
      if (/^[0-9]+$/.test(time)) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  return format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
    return value.toString().padStart(2, '0')
  })
}

/**
 * @description format time
 * @param { Number } time
 * @param { String } option
 * @returns { String }
 */
export function formatTime (time, option) {
  if (('' + time).length === 10) {
    time = parseInt('' + time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() + 1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @description get query object of the url
 * @param { String } url
 * @returns { Object }
 */
export function getQueryObject (url) {
  url = url || location.href
  const search = url.substring(url.lastIndexOf('?') + 1)
  const obj = {}
  const reg = /([^?&=]+)=([^?&=]*)/g
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1)
    let val = decodeURIComponent($2)
    val = String(val)
    obj[name] = val
    return rs
  })
  return obj
}

/**
 * @description get the byte length of an utf8 string
 * @param { String } str
 * @returns { number }
 */
export function byteLength (str) {
  let s = str.length
  for (let i = str.length - 1; i >= 0; i--) {
    const code = str.charCodeAt(i)
    if (code > 0x7f && code <= 0x7ff) {
      s++
    } else if (code > 0x7ff && code <= 0xffff) s += 2
    if (code >= 0xDC00 && code <= 0xDFFF) i--
  }
  return s
}

/**
 * @description parse json object to query string
 * @param { Object } json
 * @returns { String }
 */
export function param (json) {
  if (!json) return ''
  return Object.keys(json).map(key => {
    if (json[key] === undefined) return ''
    return encodeURIComponent(key) + '=' + encodeURIComponent(json[key])
  }).filter(item => item !== '').join('&')
}

/**
 * @description parse query string of the url to json object
 * @param { String } url
 * @returns { Object }
 */
export function param2Obj (url) {
  const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ')
  if (!search) {
    return {}
  }
  const obj = {}
  const searchArr = search.split('&')
  searchArr.forEach(v => {
    const index = v.indexOf('=')
    if (index !== -1) {
      const name = v.substring(0, index)
      obj[name] = v.substring(index + 1, v.length)
    }
  })
  return obj
}

/**
 * @description parse html to text
 * @param { String } val
 * @returns { String }
 */
export function html2Text (val) {
  const div = document.createElement('div')
  div.innerHTML = val
  return div.textContent || div.innerText
}

/**
 * @description merges two objects, giving the last one precedence
 * @param { Object } target
 * @param { Object | Array} source
 * @returns { Object }
 */
export function objectMerge (target, source) {
  if (typeof target !== 'object') {
    target = {}
  }
  if (Array.isArray(source)) {
    return source.slice()
  }
  Object.keys(source).forEach(property => {
    const sourceProperty = source[property]
    if (typeof sourceProperty === 'object') {
      target[property] = objectMerge(target[property], sourceProperty)
    } else {
      target[property] = sourceProperty
    }
  })
  return target
}

/**
 * @description toggle class of the html element
 * @param { HTMLElement } element
 * @param { String } className
 */
export function toggleClass (element, className) {
  if (!element || !className) {
    return
  }
  let classString = element.className
  const nameIndex = classString.indexOf(className)
  if (nameIndex === -1) {
    classString += '' + className
  } else {
    classString =
      classString.substr(0, nameIndex) +
      classString.substr(nameIndex + className.length)
  }
  element.className = classString
}

/**
 * @param { Function } func
 * @param { Number } wait
 * @param { Boolean } immediate
 * @returns { * }
 */
export function debounce (func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function () {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function (...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}

/**
 * @description This is just a simple version of deep copy. Has a lot of edge cases bug. If you want to use a perfect deep copy, use lodash's _.cloneDeep
 * @param { Object } source
 * @returns { Object }
 */
export function deepClone (source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments - deepClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}

/**
 * @description filter duplicate elements of an array
 * @param { Array } arr
 * @returns { Array }
 */
export function uniqueArr (arr) {
  return Array.from(new Set(arr))
}

/**
 * @description generate uuid
 * @returns { String }
 */
export function createUniqueString () {
  const timestamp = +new Date() + ''
  const randomNum = parseInt('' + ((1 + Math.random()) * 65536)) + ''
  return (+(randomNum + timestamp)).toString(32)
}

/**
 * @description generate guid
 * @returns { String }
 */
export const generateGuid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

/**
 * @description check if the html element has the class
 * @param { HTMLElement } element
 * @param { String } className
 * @returns { Boolean }
 */
export function hasClass (element, className) {
  return !!element.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'))
}

/**
 * @description add the class to the html element
 * @param { HTMLElement } element
 * @param { String } className
 */
export function addClass (element, className) {
  if (!hasClass(element, className)) element.className += ' ' + className
}

/**
 * @description remove the class from the html element
 * @param { HTMLElement } element
 * @param { String } className
 */
export function removeClass (element, className) {
  if (hasClass(element, className)) {
    const classNames = element.className.split(' ')
    classNames.splice(classNames.indexOf(className), 1)
    element.className = classNames.join(' ')
  }
}

// /**
//  * @description trigger the class of the html element
//  * @param { HTMLElement } element
//  * @param { String } className
//  * @author Jackie
//  * @date 2020-04-27 16:35
//  */
// export const triggerClass = (element, className) => {
//   if (hasClass(element, className)) {
//     removeClass(element, className)
//   } else {
//     addClass(element, className)
//   }
// }

/**
 * @description get current navigator name
 * @returns { String } current navigator name
 */
export const getExplorer = () => {
  const ua = window.navigator.userAgent
  const isExplorer = (exp) => {
    return ua.includes(exp)
  }
  if (isExplorer('MSIE')) {
    return 'IE'
  } else if (isExplorer('Firefox')) {
    return 'Firefox'
  } else if (isExplorer('Chrome')) {
    return 'Chrome'
  } else if (isExplorer('Opera')) {
    return 'Opera'
  } else if (isExplorer('Safari')) {
    return 'Safari'
  }
}

/**
 * @description bind event to html element
 * @param { HTMLElement } element
 * @param { String } event
 * @param { EventListener } handler
 */
export const on = (function () {
  if (document.addEventListener) {
    return function (element, event, handler) {
      if (element && event && handler) {
        element.addEventListener(event, handler, false)
      }
    }
  } else {
    return function (element, event, handler) {
      if (element && event && handler) {
        element.attachEvent('on' + event, handler)
      }
    }
  }
})()

/**
 * @description unbind event to html element
 * @param { HTMLElement } element
 * @param { String } event
 * @param { EventListener } handler
 */
export const off = (function () {
  if (document.removeEventListener) {
    return function (element, event, handler) {
      if (element && event) {
        element.removeEventListener(event, handler, false)
      }
    }
  } else {
    return function (element, event, handler) {
      if (element && event) {
        element.detachEvent('on' + event, handler)
      }
    }
  }
})()

/**
 * @description transform DataURL to Blob Object
 * @param { String } dataUrl
 * @returns { Blob } Blob Object
 */
export const dataURLToBlob = dataUrl => {
  const arr = dataUrl.split(',')
  const mime = arr[0].match(/:(.*?);/)[1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new Blob([u8arr], { type: mime })
}

/**
 * @description transform Image Object to Base64 String
 * @param { HTMLImageElement } image, Image Object
 * @returns { String } Base64 String
 */
export const getBase64FromImage = image => {
  const canvas = document.createElement('canvas')
  canvas.width = image.width
  canvas.height = image.height
  const ctx = canvas.getContext('2d')
  ctx.drawImage(image, 0, 0, image.width, image.height)
  const ext = image.src.substring(image.src.lastIndexOf('.') + 1).toLowerCase()
  return canvas.toDataURL('image/' + ext)
}

/**
 * @description write async await without try-catch blocks
 * @param { Promise } asyncFunc, asynchronous function
 * @returns { Promise } callback result of asynchronous function([response, error])
 */
export const asyncAction = asyncFunc => {
  return asyncFunc.then(res => {
    return [res, null]
  }).catch(error => {
    return [null, error]
  })
}

/**
 * @description invoke AlipayJSBridge
 * @param { Function } callback, callback function
 */
export const invokeAlipayJSBridge = callback => {
  // eslint-disable-next-line no-undef
  if (window.AlipayJSBridge) { // 如果 AlipayJSBridge 已经注入则直接调用
    callback && callback()
  } else { // 如果没有注入则监听注入的事件
    document.addEventListener('AlipayJSBridgeReady', callback, false)
  }
}

/**
 * @description invoke WeixinJSBridge
 * @param { Function } callback, callback function
 */
export const invokeWeixinJSBridge = callback => {
  // eslint-disable-next-line no-undef
  if (typeof WeixinJSBridge === 'undefined') {
    if (document.addEventListener) {
      document.addEventListener('WeixinJSBridgeReady', callback, false)
    } else if (document.attachEvent) {
      document.attachEvent('WeixinJSBridgeReady', callback)
      document.attachEvent('onWeixinJSBridgeReady', callback)
    }
  } else {
    callback()
  }
}

/**
 * @description transform kebab-case to camelCase
 * @param { String } str
 * @returns { String }
 * @author Jackie
 * @date 2020-03-20 09:34
 */
export const getCamelCase = (function () {
  const cache = {}
  return function (str) {
    if (!cache[str]) {
      cache[str] = str.replace(/[-_]([a-z])/g, function (match, i) {
        return i.toUpperCase()
      })
    }
    return cache[str]
  }
})()

/**
 * @description transform camelCase to kebab-case
 * @param { String } str
 * @returns { String }
 * @author Jackie
 * @date 2020-03-20 09:40
 */
export const getKebabCase = (function () {
  const cache = {}
  return function (str) {
    if (!cache[str]) {
      cache[str] = str.replace(/[A-Z]/g, function (i) {
        return '-' + i.toLowerCase()
      })
    }
    return cache[str]
  }
})()

/**
 * @description transform camelCase to snake_case
 * @param { String } str
 * @returns { String }
 * @author Jackie
 * @date 2020-04-26 15:38
 */
export const getSnakeCase = (function () {
  const cache = {}
  return function (str) {
    if (!cache[str]) {
      cache[str] = str.replace(/[A-Z]/g, function (i) {
        return '_' + i.toLowerCase()
      })
    }
    return cache[str]
  }
})()

/**
 * @description get the final CSS property value of the element
 * @param { HTMLElement } element
 * @param { String } property
 * @returns { * }
 * @author Jackie
 * @date 2020-03-20 09:04
 */
export function getFinalStyle (element, property) {
  return window.getComputedStyle ? getComputedStyle(element).getPropertyValue(getKebabCase(property)) : element.currentStyle.getAttribute(getCamelCase(property))
}

/**
 * @description get intersection of two arrays
 * @param { Array } arr1
 * @param { Array } arr2
 * @returns { Array } intersection of two arrays
 * @author Jackie
 * @date 2020-04-05 02:03
 */
export const getArrayIntersection = (arr1, arr2) => {
  return arr1.filter(v => arr2.includes(v))
}

/**
 * @description get union of two arrays
 * @param { Array } arr1
 * @param { Array } arr2
 * @returns { Array } union of two arrays
 * @author Jackie
 * @date 2020-04-05 02:10
 */
export const getArrayUnion = (arr1, arr2) => {
  return [...arr1, ...arr2.filter(v => !arr1.includes(v))]
}

/**
 * @description get difference of two arrays
 * @param { Array } arr1
 * @param { Array } arr2
 * @returns { Array } difference of two arrays
 * @author Jackie
 * @date 2020-04-05 02:13
 */
export const getArrayDifference = (arr1, arr2) => {
  return [...arr1, ...arr2].filter(v => arr1.includes(v) && !arr2.includes(v))
}

/**
 * @description 获取树形结构数据的指定节点
 * @param { String } property 指定属性
 * @param { String } value 指定值
 * @param { Array } data 树形结构数据
 * @returns { Object } 指定节点
 * @author Jackie
 * @date 2020-06-20 10:10
 */
export const getNodeByPropertyRecursively = (property, value, data) => {
  let node = null
  for (let i = 0; i < data.length; i++) {
    if (data[i][property] === value) {
      node = data[i]
    } else if (Array.isArray(data[i].children) && data[i].children.length) {
      node = getNodeByPropertyRecursively(property, value, data[i].children)
    }
    if (node) break
  }
  return node
}

/**
 * @description 校验密码强度
 * @param { String } value 密码
 * @returns { Object } 密码强度（ WEEK - 弱，MEDIUM - 中，STRONG - 强，STRONGEST - 极强 ）
 * @author Jackie
 * @date 2020-06-30 10:49
 */
export const verifyPasswordStrength = (value) => {
  if (value.length < 6) {
    return null
  }
  let mode = 0
  // 数字
  if (/\d/.test(value)) mode++
  // 小写字母
  if (/[a-z]/.test(value)) mode++
  // 大写字母
  if (/[A-Z]/.test(value)) mode++
  // 特殊字符
  if (/\W|_/.test(value)) mode++
  switch (mode) {
    case 1:
      return {
        value: 'WEEK',
        label: '弱',
        level: 1,
        color: '#ed4014'
      }
    case 2:
      return {
        value: 'MEDIUM',
        label: '中',
        level: 2,
        color: '#ff9900'
      }
    case 3:
      return {
        value: 'STRONG',
        label: '强',
        level: 3,
        color: '#19be6b'
      }
    case 4:
      return {
        value: 'STRONGEST',
        label: '极强',
        level: 4,
        color: '#19be6b'
      }
    default:
      return {}
  }
}

/**
 * @description 下载文件
 * @param { String } url 下载地址
 * @param { String } name 文件名
 * @param { Function } cb 回调函数
 * @author Jackie
 * @date 2020-08-07 08:28
 */
export const downloadFile = (url, name, cb) => {
  // const FileSaver = require('file-saver')
  // const xhr = new XMLHttpRequest()
  // xhr.open('GET', url, true)
  // xhr.responseType = 'blob'
  // xhr.onload = _ => {
  //   const file = new Blob([xhr.response])
  //   FileSaver.saveAs(file, name)
  //   cb && cb()
  // }
  // xhr.send()
  const a = document.createElement('a')
  a.style.display = 'none'
  a.href = url
  a.target = '_blank'
  a.download = name
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  cb && cb()
}

/**
 * @description get the type of specified value
 * @param { * } value
 * @returns { String }
 * @author Jackie
 * @date 2020-08-12 09:03
 */
export const getType = (value) => {
  // return Object.prototype.toString.call(value).replace(/^\[object (.+)\]$/, '$1').toLowerCase()
  return Object.prototype.toString.call(value).slice(8, -1).toLowerCase()
}
