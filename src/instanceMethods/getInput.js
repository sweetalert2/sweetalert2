import * as dom from '../utils/dom/index.js'
import privateProps from '../privateProps.js'

// Get input element by specified type or, if type isn't specified, by params.input
export function getInput (instance) {
  const innerParams = privateProps.innerParams.get(instance || this)
  const domCache = privateProps.domCache.get(instance || this)
  if (!domCache) {
    return null
  }
  return dom.getInput(domCache.content, innerParams.input)
}
