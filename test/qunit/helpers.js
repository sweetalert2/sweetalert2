const { detect } = require('detect-browser')

const browser = detect()
export const TIMEOUT = browser.name === 'ie' ? 100 : 0

export const initialSwalPropNames = Object.keys(global.swal)
export const swal = global.swal
