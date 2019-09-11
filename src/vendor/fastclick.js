/** 解决移动端 300ms 延迟的问题 */
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
//     /* 修复bug ios 11.3不弹出键盘，这里加上聚焦代码，让其强制聚焦弹出键盘 */
//     targetElement.focus()
//     targetElement.setSelectionRange(length, length)
//   } else {
//     targetElement.focus()
//   }
// }
