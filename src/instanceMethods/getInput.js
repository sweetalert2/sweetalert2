import { swalClasses } from '../utils/classes.js'
import privateProps from '../privateProps.js'
import * as dom from '../utils/dom/index.js'

/**
 * Gets the input DOM node, this method works with input parameter.
 *
 * @returns {HTMLInputElement | (HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement)[] | null}
 * @this {SweetAlert}
 */
export function getInput() {
  const innerParams = privateProps.innerParams.get(this)
  const domCache = privateProps.domCache.get(this)
  if (!domCache) {
    return null
  }
  const input = dom.getInput(domCache.popup, innerParams.input)
  if (Array.isArray(innerParams.input) && !input) {
    return Array.from(domCache.popup.querySelectorAll(`.${swalClasses.input}, .${swalClasses.select}, .${swalClasses.textarea}, .${swalClasses.file}, .${swalClasses.checkbox} input, .${swalClasses.radio} input`))
  }
  return input
}
