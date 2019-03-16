import privateProps from '../privateProps.js'

function setButtonsDisabled (buttons, disabled) {
  buttons.forEach(button => {
    button.disabled = disabled
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
  const domCache = privateProps.domCache.get(this)
  setButtonsDisabled([domCache.confirmButton, domCache.cancelButton], false)
}

export function disableButtons () {
  const domCache = privateProps.domCache.get(this)
  setButtonsDisabled([domCache.confirmButton, domCache.cancelButton], true)
}

export function enableConfirmButton () {
  const domCache = privateProps.domCache.get(this)
  setButtonsDisabled([domCache.confirmButton], false)
}

export function disableConfirmButton () {
  const domCache = privateProps.domCache.get(this)
  setButtonsDisabled([domCache.confirmButton], true)
}

export function enableInput () {
  setInputDisabled(this.getInput(), false)
}

export function disableInput () {
  setInputDisabled(this.getInput(), true)
}
