const { detect } = require('detect-browser')

const browser = detect()
export const TIMEOUT = browser.name === 'ie' ? 100 : 0

// We *only* access `swal` through this module, so that we can be sure `initialSwalPropNames` is set properly
export const initialSwalPropNames = Object.keys(global.swal)
export const swal = global.swal
