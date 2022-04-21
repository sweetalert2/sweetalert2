export const consolePrefix = 'SweetAlert2:'

/**
 * Filter the unique values into a new array
 * @param arr
 */
export const uniqueArray = (arr) => {
  const result = []
  for (let i = 0; i < arr.length; i++) {
    if (result.indexOf(arr[i]) === -1) {
      result.push(arr[i])
    }
  }
  return result
}

/**
 * Capitalize the first letter of a string
 * @param {string} str
 * @returns {string}
 */
export const capitalizeFirstLetter = (str) => str.charAt(0).toUpperCase() + str.slice(1)

/**
 * @param {NodeList | HTMLCollection | NamedNodeMap} nodeList
 * @returns {array}
 */
export const toArray = (nodeList) => Array.prototype.slice.call(nodeList)

/**
 * Standardize console warnings
 * @param {string | array} message
 */
export const warn = (message) => {
  console.warn(`${consolePrefix} ${typeof message === 'object' ? message.join(' ') : message}`)
}

/**
 * Standardize console errors
 * @param {string} message
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
 * @param {string} message
 */
export const warnOnce = (message) => {
  if (!previousWarnOnceMessages.includes(message)) {
    previousWarnOnceMessages.push(message)
    warn(message)
  }
}

/**
 * Show a one-time console warning about deprecated params/methods
 */
export const warnAboutDeprecation = (deprecatedParam, useInstead) => {
  warnOnce(
    `"${deprecatedParam}" is deprecated and will be removed in the next major release. Please use "${useInstead}" instead.`
  )
}

/**
 * If `arg` is a function, call it (with no arguments or context) and return the result.
 * Otherwise, just pass the value through
 * @param arg
 */
export const callIfFunction = (arg) => (typeof arg === 'function' ? arg() : arg)

export const hasToPromiseFn = (arg) => arg && typeof arg.toPromise === 'function'

export const asPromise = (arg) => (hasToPromiseFn(arg) ? arg.toPromise() : Promise.resolve(arg))

export const isPromise = (arg) => arg && Promise.resolve(arg) === arg

export const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)]
