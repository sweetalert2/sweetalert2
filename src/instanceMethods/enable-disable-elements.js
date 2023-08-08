import * as dom from '../utils/dom/index.js'
import privateProps from '../privateProps.js'
import { swalClasses } from '../utils/classes.js'

/**
 * @param {SweetAlert} instance
 * @param {string[]} buttons
 * @param {boolean} disabled
 */
function setButtonsDisabled(instance, buttons, disabled) {
  const domCache = privateProps.domCache.get(instance)
  buttons.forEach((button) => {
    domCache[button].disabled = disabled
  })
}

/**
 * @param {HTMLInputElement | null} input
 * @param {boolean} disabled
 */
function setInputDisabled(input, disabled) {
  const popup = dom.getPopup()
  if (!popup || !input) {
    return
  }
  if (input.type === 'radio') {
    /** @type {NodeListOf<HTMLInputElement>} */
    const radios = popup.querySelectorAll(`[name="${swalClasses.radio}"]`)
    for (let i = 0; i < radios.length; i++) {
      radios[i].disabled = disabled
    }
  } else {
    input.disabled = disabled
  }
}

/**
 * Enable all the buttons
 * @this {SweetAlert}
 */
export function enableButtons() {
  setButtonsDisabled(this, ['confirmButton', 'denyButton', 'cancelButton'], false)
}

/**
 * Disable all the buttons
 * @this {SweetAlert}
 */
export function disableButtons() {
  setButtonsDisabled(this, ['confirmButton', 'denyButton', 'cancelButton'], true)
}

/**
 * Enable the input field
 * @this {SweetAlert}
 */
export function enableInput() {
  setInputDisabled(this.getInput(), false)
}

/**
 * Disable the input field
 * @this {SweetAlert}
 */
export function disableInput() {
  setInputDisabled(this.getInput(), true)
}
