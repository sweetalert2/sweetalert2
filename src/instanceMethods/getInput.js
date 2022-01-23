import * as dom from '../utils/dom/index.js'
import privateProps from '../privateProps.js'

/**
 * Gets the input DOM node, this method works with input parameter.
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
