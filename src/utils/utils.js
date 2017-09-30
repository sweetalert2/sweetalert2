export const consolePrefix = 'SweetAlert2:'

/*
 * Set hover, active and focus-states for buttons (source: http://www.sitepoint.com/javascript-generate-lighter-darker-color)
 */
export const colorLuminance = (hex, lum) => {
  // Validate hex string
  hex = String(hex).replace(/[^0-9a-f]/gi, '')
  if (hex.length < 6) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
  }
  lum = lum || 0

  // Convert to decimal and change luminosity
  let rgb = '#'
  for (let i = 0; i < 3; i++) {
    let c = parseInt(hex.substr(i * 2, 2), 16)
    c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16)
    rgb += ('00' + c).substr(c.length)
  }

  return rgb
}

export const uniqueArray = (arr) => {
  const result = []
  for (var i in arr) {
    if (result.indexOf(arr[i]) === -1) {
      result.push(arr[i])
    }
  }
  return result
}

/**
 * Standardise console warnings
 * @param message
 */
export const warn = (message) => {
  console.warn(`${consolePrefix} ${message}`)
}

/**
 * Standardise console errors
 * @param message
 */
export const error = (message) => {
  console.error(`${consolePrefix} ${message}`)
}
