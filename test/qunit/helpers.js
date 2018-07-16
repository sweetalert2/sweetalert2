/* global CustomEvent */
require('custom-event-polyfill') // for IE11
const { detect } = require('detect-browser')

const browser = detect()

export const $ = document.querySelector.bind(document)

export const isVisible = (elem) => elem && (elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length)
export const isHidden = (elem) => !isVisible(elem)

export let TIMEOUT = 1

if (browser.name === 'ie') {
  TIMEOUT = 100
} else if (browser.os === 'Android OS') {
  TIMEOUT = 500
}

// We *only* access `Swal` through this module, so that we can be sure `initialSwalPropNames` is set properly
export const initialSwalPropNames = Object.keys(global.Swal)
export const Swal = global.Swal
export const SwalWithoutAnimation = Swal.mixin({animation: false})

export const dispatchCustomEvent = (elem, eventName, eventDetail = {}) => {
  var event = new CustomEvent(eventName, {bubbles: true, cancelable: true, detail: eventDetail})
  elem.dispatchEvent(event)
}

export const triggerEscape = () => {
  const e = document.createEvent('HTMLEvents')
  e.key = 'Escape'
  e.initEvent(
    'keydown',
    true, // bubbles
    true  // cancelable
  )
  Swal.getPopup().dispatchEvent(e)
}
