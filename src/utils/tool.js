/**
 * @returns { String } 当前浏览器名称
 */
export const getExplorer = () => {
  const ua = window.navigator.userAgent
  const isExplorer = (exp) => {
    return ua.indexOf(exp) > -1
  }
  if (isExplorer('MSIE')) {
    return 'IE'
  } else if (isExplorer('Firefox')) {
    return 'Firefox'
  } else if (isExplorer('Chrome')) {
    return 'Chrome'
  } else if (isExplorer('Opera')) {
    return 'Opera'
  } else if (isExplorer('Safari')) return 'Safari'
}

/**
 * @description 绑定事件 on(element, event, handler)
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
 * @description 解绑事件 off(element, event, handler)
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
 * @description: DataURL 转 Blob 对象
 * @params: { String } dataUrl
 * @return: { Blob } Blob 对象
 * @author: Jackie
 * @date: 2019/8/27 19:33
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
 * @description: 图片对象转Base64
 * @params: { Object } image 图片对象
 * @return: { String } base64字符串
 * @author: Jackie
 * @date: 2019/8/27 21:10
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
 * @description: 将对象的指定字段置为任意值（ null 或 undefined ）
 * @params: { Object, Array, * } obj 源对象，keys 需要赋值的key，value 值
 * @return: { Object } 转换后的对象
 * @author: Jackie
 * @date: 2019/9/19 17:11
 */
export const replaceObjProps = (obj, keys, value) => {
  return JSON.parse(JSON.stringify(obj, (k, v) => {
    if (keys.includes[k]) {
      return value
    } else {
      return v
    }
  }))
}
