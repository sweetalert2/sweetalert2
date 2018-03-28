import * as dom from '../utils/dom/index'
import { swalClasses } from '../utils/classes'

// Get input element by specified type or, if type isn't specified, by params.input
export function getInput (inputType) {
  const domCache = this._domCache
  inputType = inputType || this.params.input
  if (!inputType) {
    return null
  }
  switch (inputType) {
    case 'select':
    case 'textarea':
    case 'file':
      return dom.getChildByClass(domCache.content, swalClasses[inputType])
    case 'checkbox':
      return domCache.popup.querySelector(`.${swalClasses.checkbox} input`)
    case 'radio':
      return domCache.popup.querySelector(`.${swalClasses.radio} input:checked`) ||
        domCache.popup.querySelector(`.${swalClasses.radio} input:first-child`)
    case 'range':
      return domCache.popup.querySelector(`.${swalClasses.range} input`)
    default:
      return dom.getChildByClass(domCache.content, swalClasses.input)
  }
}
