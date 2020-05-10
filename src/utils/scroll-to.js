Math.easeInOutQuad = function (t, b, c, d) {
  t /= d / 2
  if (t < 1) {
    return c / 2 * t * t + b
  }
  t--
  return -c / 2 * (t * (t - 2) - 1) + b
}

// requestAnimationFrame for Smart Animating http://goo.gl/sx5sts
const requestAnimFrame = (function () {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) { window.setTimeout(callback, 1000 / 60) }
})()

/**
 * Because it's so fucking difficult to detect the scrolling element, just move them all
 * @param { HTMLElement } element
 * @param { Number } amount
 */
function move (element, amount) {
  if (element) {
    element.scrollTop = amount
  } else {
    document.documentElement.scrollTop = amount
    document.body.parentNode.scrollTop = amount
    document.body.scrollTop = amount
  }
}

/**
 * @param { HTMLElement } element
 * @returns {number | *}
 */
function position (element) {
  return element ? element.scrollTop : document.documentElement.scrollTop || document.body.parentNode.scrollTop || document.body.scrollTop
}

/**
 * @param { HTMLElement } element
 * @param { Number } to
 * @param { Number } duration
 * @param { Function } callback
 */
export function scrollTo (element, to, duration, callback = null) {
  const start = position(element)
  const change = to - start
  const increment = 20
  let currentTime = 0
  duration = (typeof (duration) === 'undefined') ? 500 : duration
  const animateScroll = function () {
    // increment the time
    currentTime += increment
    // find the value with the quadratic in-out easing function
    const val = Math.easeInOutQuad(currentTime, start, change, duration)
    // move the scrolling element
    move(element, val)
    // do the animation unless its over
    if (currentTime < duration) {
      requestAnimFrame(animateScroll)
    } else {
      if (callback && typeof (callback) === 'function') {
        // the animation is done so lets callback
        callback()
      }
    }
  }
  animateScroll()
}
