import privateProps from '../privateProps.js'
import * as dom from '../utils/dom/index.js'

/**
 * Gets the input DOM node, this method works with input parameter.
 *
 * @param {SweetAlert2} instance
 * @returns {HTMLElement | null}
 */
export function getInput(instance) {
  const innerParams = privateProps.innerParams.get(instance || this)
  const domCache = privateProps.domCache.get(instance || this)
  if (!domCache) {
    return null
  }
  return dom.getInput(domCache.popup, innerParams.input)
}
