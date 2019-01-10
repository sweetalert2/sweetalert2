/* global CustomEvent */
require('custom-event-polyfill') // for IE11

export const $ = document.querySelector.bind(document)

export const isIE = window.navigator.userAgent.indexOf('Trident/') > 0

export const isVisible = (elem) => elem && (elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length)
export const isHidden = (elem) => !isVisible(elem)

export let TIMEOUT = 1

if (isIE) {
  TIMEOUT = 100
}

// We *only* access `Swal` through this module, so that we can be sure `initialSwalPropNames` is set properly
export const initialSwalPropNames = Object.keys(global.Swal)
export const Swal = global.Swal
export const SwalWithoutAnimation = Swal.mixin({ animation: false })

export const dispatchCustomEvent = (elem, eventName, eventDetail = {}) => {
  const event = new CustomEvent(eventName, { bubbles: true, cancelable: true, detail: eventDetail })
  elem.dispatchEvent(event)
}

export const triggerKeydownEvent = (target, key, params = {}) => {
  const e = document.createEvent('HTMLEvents')
  e.key = key
  e.initEvent(
    'keydown',
    true, // bubbles
    true  // cancelable
  )
  for (const param in params) {
    e[param] = params[param]
  }
  target.dispatchEvent(e)
}
