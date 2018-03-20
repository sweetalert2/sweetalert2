// Currently, `this` is the private `context` (or `currentContext`) object

import * as dom from '../utils/dom/index'
import { getInput } from './getInput'
import { swalClasses } from '../utils/classes'

// Show block with validation error
export function showValidationError (error) {
  const {domCache} = this
  domCache.validationError.innerHTML = error
  const popupComputedStyle = window.getComputedStyle(domCache.popup)
  domCache.validationError.style.marginLeft = `-${popupComputedStyle.getPropertyValue('padding-left')}`
  domCache.validationError.style.marginRight = `-${popupComputedStyle.getPropertyValue('padding-right')}`
  dom.show(domCache.validationError)

  const input = getInput.call(this)
  if (input) {
    input.setAttribute('aria-invalid', true)
    input.setAttribute('aria-describedBy', swalClasses.validationerror)
    dom.focusInput(input)
    dom.addClass(input, swalClasses.inputerror)
  }
}

// Hide block with validation error
export function resetValidationError () {
  const {domCache} = this
  if (domCache.validationError) {
    dom.hide(domCache.validationError)
  }

  const input = getInput.call(this)
  if (input) {
    input.removeAttribute('aria-invalid')
    input.removeAttribute('aria-describedBy')
    dom.removeClass(input, swalClasses.inputerror)
  }
}
