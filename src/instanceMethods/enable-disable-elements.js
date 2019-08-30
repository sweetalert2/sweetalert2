import privateProps from '../privateProps.js'
import { warnAboutDepreation } from '../utils/utils.js'

function setButtonsDisabled (instance, buttons, disabled) {
  const domCache = privateProps.domCache.get(instance)
  buttons.forEach(button => {
    domCache[button].disabled = disabled
  })
}

function setInputDisabled (input, disabled) {
  if (!input) {
    return false
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

export function enableButtons () {
  setButtonsDisabled(this, ['confirmButton', 'cancelButton'], false)
}

export function disableButtons () {
  setButtonsDisabled(this, ['confirmButton', 'cancelButton'], true)
}

// @deprecated
export function enableConfirmButton () {
  warnAboutDepreation('Swal.enableConfirmButton()', `Swal.getConfirmButton().removeAttribute('disabled')`)
  setButtonsDisabled(this, ['confirmButton'], false)
}

// @deprecated
export function disableConfirmButton () {
  warnAboutDepreation('Swal.disableConfirmButton()', `Swal.getConfirmButton().setAttribute('disabled', '')`)
  setButtonsDisabled(this, ['confirmButton'], true)
}

export function enableInput () {
  return setInputDisabled(this.getInput(), false)
}

export function disableInput () {
  return setInputDisabled(this.getInput(), true)
}
