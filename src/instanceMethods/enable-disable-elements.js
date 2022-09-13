import privateProps from '../privateProps.js'

/**
 * @param {SweetAlert2} instance
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

export function enableButtons() {
  setButtonsDisabled(this, ['confirmButton', 'denyButton', 'cancelButton'], false)
}

export function disableButtons() {
  setButtonsDisabled(this, ['confirmButton', 'denyButton', 'cancelButton'], true)
}

export function enableInput() {
  setInputDisabled(this.getInput(), false)
}

export function disableInput() {
  setInputDisabled(this.getInput(), true)
}
