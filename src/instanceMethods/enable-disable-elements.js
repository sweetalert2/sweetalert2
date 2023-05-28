import privateProps from '../privateProps.js'

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
 * @param {HTMLInputElement} input
 * @param {boolean} disabled
 */
function setInputDisabled(input, disabled) {
  if (!input) {
    return
  }
  if (input.type === 'radio') {
    const radiosContainer = input.parentNode.parentNode
    const radios = radiosContainer.querySelectorAll('input')
    for (let i = 0; i < radios.length; i++) {
      radios[i].disabled = disabled
    }
  } else {
    input.disabled = disabled
  }
}

/**
 * Enable all the buttons
 */
export function enableButtons() {
  setButtonsDisabled(this, ['confirmButton', 'denyButton', 'cancelButton'], false)
}

/**
 * Disable all the buttons
 */
export function disableButtons() {
  setButtonsDisabled(this, ['confirmButton', 'denyButton', 'cancelButton'], true)
}

/**
 * Enable the input field
 */
export function enableInput() {
  setInputDisabled(this.getInput(), false)
}

/**
 * Disable the input field
 */
export function disableInput() {
  setInputDisabled(this.getInput(), true)
}
