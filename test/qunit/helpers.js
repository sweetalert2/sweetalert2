const { detect } = require('detect-browser')
const browser = detect()
export const TIMEOUT = browser.name === 'ie' ? 100 : 0
