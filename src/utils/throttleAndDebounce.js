/**
*@name:节流和防抖
*@description:
*@author:joyce
*@time:
*/

// 节流
export function throttle(fn, delay = 500) {
  let valid = true
  return function() {
    if (!valid) {
      return false
    }
    valid = false
    setTimeout(() => {
      fn().apply(this, arguments)
      valid = true
    }, delay)
  }
}

// 防抖
export function debounce(fn, delay = 500) {
  let timer = null
  return function () {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, arguments)
      timer = null
    }, delay)
  }
}
