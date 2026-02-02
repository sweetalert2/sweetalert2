import { error } from '../utils/utils.js'

/**
 * @param {unknown} elem
 * @returns {boolean}
 */
const isJqueryElement = (elem) => typeof elem === 'object' && elem !== null && 'jquery' in elem

/**
 * @param {unknown} elem
 * @returns {boolean}
 */
const isElement = (elem) => elem instanceof Element || isJqueryElement(elem)

/**
 * @param {ReadonlyArray<unknown>} args
 * @returns {SweetAlertOptions}
 */
export const argsToParams = (args) => {
  /** @type {Record<string, unknown>} */
  const params = {}
  if (typeof args[0] === 'object' && !isElement(args[0])) {
    Object.assign(params, args[0])
  } else {
    ;['title', 'html', 'icon'].forEach((name, index) => {
      const arg = args[index]
      if (typeof arg === 'string' || isElement(arg)) {
        params[name] = arg
      } else if (arg !== undefined) {
        error(`Unexpected type of ${name}! Expected "string" or "Element", got ${typeof arg}`)
      }
    })
  }
  return /** @type {SweetAlertOptions} */ (params)
}
