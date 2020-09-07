import privateProps from '../privateProps.js'

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
  setButtonsDisabled(this, ['confirmButton', 'denyButton', 'cancelButton'], false)
}

export function disableButtons () {
  setButtonsDisabled(this, ['confirmButton', 'denyButton', 'cancelButton'], true)
}

export function enableInput () {
  return setInputDisabled(this.getInput(), false)
}

export function disableInput () {
  return setInputDisabled(this.getInput(), true)
}
