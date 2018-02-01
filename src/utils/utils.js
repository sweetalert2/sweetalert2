export const consolePrefix = 'SweetAlert2:'

/**
 * Filter the unique values into a new array
 * @param arr
 */
export const uniqueArray = (arr) => {
  const result = []
  for (let elem of arr) {
    if (result.indexOf(elem) === -1) {
      result.push(elem)
    }
  }
  return result
}

/**
 * Convert object into iterable Map
 * https://stackoverflow.com/a/36644532/1331425
 * @param obj
 */
export const objectToMap = (obj) => {
  if (obj instanceof Map) {
    return obj
  }
  const map = new Map()
  Object.keys(obj).forEach(key => {
    map.set(key, obj[key])
  })
  return map
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

/**
 * Private global state for `warnOnce`
 * @type {Array}
 * @private
 */
const previousWarnOnceMessages = []

/**
 * Show a console warning, but only if it hasn't already been shown
 * @param message
 */
export const warnOnce = (message) => {
  if (!previousWarnOnceMessages.includes(message)) {
    previousWarnOnceMessages.push(message)
    warn(message)
  }
}

/**
 * If `arg` is a function, call it (with no arguments or context) and return the result.
 * Otherwise, just pass the value through
 * @param arg
 */
export const callIfFunction = (arg) => typeof arg === 'function' ? arg() : arg
