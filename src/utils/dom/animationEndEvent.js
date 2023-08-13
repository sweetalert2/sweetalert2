import { isNodeEnv } from '../isNodeEnv.js'

/**
 * @returns {'webkitAnimationEnd' | 'animationend' | false}
 */
export const animationEndEvent = (() => {
  // Prevent run in Node env
  if (isNodeEnv()) {
    return false
  }

  const testEl = document.createElement('div')

  // Chrome, Safari and Opera
  if (typeof testEl.style.webkitAnimation !== 'undefined') {
    return 'webkitAnimationEnd'
  }

  // Standard syntax
  if (typeof testEl.style.animation !== 'undefined') {
    return 'animationend'
  }

  return false
})()
