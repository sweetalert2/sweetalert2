/* istanbul ignore file */
import { swalClasses } from '../utils/classes.js'
import * as dom from './dom/index.js'

// Fix iOS scrolling http://stackoverflow.com/q/39626302

export const iOSfix = () => {
  const iOS =
    // @ts-ignore
    (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  if (iOS && !dom.hasClass(document.body, swalClasses.iosfix)) {
    const offset = document.body.scrollTop
    document.body.style.top = `${offset * -1}px`
    dom.addClass(document.body, swalClasses.iosfix)
    lockBodyScroll()
  }
}

/**
 * https://github.com/sweetalert2/sweetalert2/issues/1246
 */
const lockBodyScroll = () => {
  const container = dom.getContainer()
  let preventTouchMove
  /**
   * @param {TouchEvent} event
   */
  container.ontouchstart = (event) => {
    preventTouchMove = shouldPreventTouchMove(event)
  }
  /**
   * @param {TouchEvent} event
   */
  container.ontouchmove = (event) => {
    if (preventTouchMove) {
      event.preventDefault()
      event.stopPropagation()
    }
  }
}

/**
 * @param {TouchEvent} event
 * @returns {boolean}
 */
const shouldPreventTouchMove = (event) => {
  const target = event.target
  const container = dom.getContainer()
  if (isStylus(event) || isZoom(event)) {
    return false
  }
  if (target === container) {
    return true
  }
  if (
    !dom.isScrollable(container) &&
    target instanceof HTMLElement &&
    target.tagName !== 'INPUT' && // #1603
    target.tagName !== 'TEXTAREA' && // #2266
    !(
      dom.isScrollable(dom.getHtmlContainer()) && // #1944
      dom.getHtmlContainer().contains(target)
    )
  ) {
    return true
  }
  return false
}

/**
 * https://github.com/sweetalert2/sweetalert2/issues/1786
 *
 * @param {*} event
 * @returns {boolean}
 */
const isStylus = (event) => {
  return event.touches && event.touches.length && event.touches[0].touchType === 'stylus'
}

/**
 * https://github.com/sweetalert2/sweetalert2/issues/1891
 *
 * @param {TouchEvent} event
 * @returns {boolean}
 */
const isZoom = (event) => {
  return event.touches && event.touches.length > 1
}

export const undoIOSfix = () => {
  if (dom.hasClass(document.body, swalClasses.iosfix)) {
    const offset = parseInt(document.body.style.top, 10)
    dom.removeClass(document.body, swalClasses.iosfix)
    document.body.style.top = ''
    document.body.scrollTop = offset * -1
  }
}
