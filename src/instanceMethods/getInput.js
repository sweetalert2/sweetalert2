import privateProps from '../privateProps.js'
import * as dom from '../utils/dom/index.js'

/**
 * Gets the input DOM node, this method works with input parameter.
 *
 * @returns {HTMLInputElement | null}
 */
export function getInput() {
  const innerParams = privateProps.innerParams.get(this)
  const domCache = privateProps.domCache.get(this)
  if (!domCache) {
    return null
  }
  return dom.getInput(domCache.popup, innerParams.input)
}
