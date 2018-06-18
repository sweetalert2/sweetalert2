const { detect } = require('detect-browser')

const browser = detect()

export let TIMEOUT = 1

if (browser.name === 'ie' || browser.os === 'Android OS') {
  TIMEOUT = 100
}

// We *only* access `Swal` through this module, so that we can be sure `initialSwalPropNames` is set properly
export const initialSwalPropNames = Object.keys(global.Swal)
export const Swal = global.Swal
export const SwalWithoutAnimation = Swal.mixin({animation: false})

export const triggerEscape = () => {
  const e = document.createEvent('HTMLEvents')
  e.key = 'Escape'
  e.initEvent('keydown', false, true)
  document.body.dispatchEvent(e)
}
