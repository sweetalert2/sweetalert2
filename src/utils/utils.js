export const consolePrefix = 'SweetAlert2:'

/**
 * Capitalize the first letter of a string
 *
 * @param {string} str
 * @returns {string}
 */
export const capitalizeFirstLetter = (str) => str.charAt(0).toUpperCase() + str.slice(1)

/**
 * Standardize console warnings
 *
 * @param {string | string[]} message
 */
export const warn = (message) => {
  console.warn(`${consolePrefix} ${typeof message === 'object' ? message.join(' ') : message}`)
}

/**
 * Standardize console errors
 *
 * @param {string} message
 */
export const error = (message) => {
  console.error(`${consolePrefix} ${message}`)
}

/**
 * Private global state for `warnOnce`
 *
 * @type {string[]}
 * @private
 */
const previousWarnOnceMessages = []

/**
 * Show a console warning, but only if it hasn't already been shown
 *
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
 *
 * @param {string} deprecatedParam
 * @param {string} useInstead
 */
export const warnAboutDeprecation = (deprecatedParam, useInstead) => {
  warnOnce(
    `"${deprecatedParam}" is deprecated and will be removed in the next major release. Please use "${useInstead}" instead.`
  )
}

/**
 * If `arg` is a function, call it (with no arguments or context) and return the result.
 * Otherwise, just pass the value through
 *
 * @param {Function | any} arg
 * @returns {any}
 */
export const callIfFunction = (arg) => (typeof arg === 'function' ? arg() : arg)

/**
 * @param {any} arg
 * @returns {boolean}
 */
export const hasToPromiseFn = (arg) => arg && typeof arg.toPromise === 'function'

/**
 * @param {any} arg
 * @returns {Promise<any>}
 */
export const asPromise = (arg) => (hasToPromiseFn(arg) ? arg.toPromise() : Promise.resolve(arg))

/**
 * @param {any} arg
 * @returns {boolean}
 */
export const isPromise = (arg) => arg && Promise.resolve(arg) === arg
