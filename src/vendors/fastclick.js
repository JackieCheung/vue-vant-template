import FastClick from 'fastclick'

FastClick.attach(document.body)

const deviceIsWindowsPhone = navigator.userAgent.indexOf('Windows Phone') >= 0
const deviceIsIOS = /iP(ad|hone|od)/.test(navigator.userAgent) && !deviceIsWindowsPhone

/** 解决富文本编辑器不能获取焦点的问题 */
/**
 * @description: 判断当前元素的所有父级元素是否包含有指定的className
 * @params: { Object, String } target 当前元素，className 类名
 * @return: { Boolean } true or false
 * @author: Jackie
 * @date: 2019/10/25 15:00
 */
const checkParentsHasClassName = (target, className) => {
  return target && (new RegExp(`${className}`).test(target.className) || target.parentElement && checkParentsHasClassName(target.parentElement, className) || false)
}

/**
 * Determine whether a given element requires a native click.
 *
 * @param {EventTarget|Element} target Target DOM element
 * @returns {boolean} Returns true if the element needs a native click
 */
FastClick.prototype.needsClick = function (target) {
  switch (target.nodeName.toLowerCase()) {
    // Don't send a synthetic click to disabled inputs (issue #62)
    case 'button':
    case 'select':
    case 'textarea':
      if (target.disabled) {
        return true
      }
      break
    case 'input':
      // File inputs need real clicks on iOS 6 due to a browser bug (issue #68)
      if ((deviceIsIOS && target.type === 'file') || target.disabled) {
        return true
      }
      break
    case 'label':
    case 'iframe': // iOS8 homescreen apps can prevent events bubbling into frames
    case 'video':
      return true
  }
  return (/\bneedsclick\b/).test(target.className) || checkParentsHasClassName(target, 'quill-editor')
}

/** 解决移动端 300ms 延迟的问题 */
/**
 * detail
 * @see https://github.com/ftlabs/fastclick/issues/358
 */
FastClick.prototype.focus = function (targetElement) {
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
