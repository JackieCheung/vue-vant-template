/**
 * @description: 调用 AlipayJSBridge
 * @author: Jackie
 * @date: 2019/9/10 16:49
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
 * @description: 调用 WeixinJSBridge
 * @author: Jackie
 * @date: 2019/9/10 16:50
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
 * @description: 统一捕获异步函数的异常
 * @params: { Function } asyncFunc 异步函数
 * @return: { Promise } 异步函数的回调结果
 * @author: Jackie
 * @date: 2019/9/18 23:42
 */
export const asyncAction = asyncFunc => {
  return asyncFunc.then(res => {
    return [null, res]
  }).catch(err => {
    return [err, null]
  })
}
