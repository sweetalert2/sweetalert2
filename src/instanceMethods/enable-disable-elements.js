// Currently, `this` is the private `context` (or `currentContext`) object

import { getInput } from './getInput'

export function enableButtons () {
  this.domCache.confirmButton.disabled = false
  this.domCache.cancelButton.disabled = false
}

export function disableButtons () {
  this.domCache.confirmButton.disabled = true
  this.domCache.cancelButton.disabled = true
}

export function enableConfirmButton () {
  this.domCache.confirmButton.disabled = false
}

export function disableConfirmButton () {
  this.domCache.confirmButton.disabled = true
}

export function enableInput () {
  const input = getInput.call(this)
  if (!input) {
    return false
  }
  if (input.type === 'radio') {
    const radiosContainer = input.parentNode.parentNode
    const radios = radiosContainer.querySelectorAll('input')
    for (let i = 0; i < radios.length; i++) {
      radios[i].disabled = false
    }
  } else {
    input.disabled = false
  }
}

export function disableInput () {
  const input = getInput.call(this)
  if (!input) {
    return false
  }
  if (input && input.type === 'radio') {
    const radiosContainer = input.parentNode.parentNode
    const radios = radiosContainer.querySelectorAll('input')
    for (let i = 0; i < radios.length; i++) {
      radios[i].disabled = true
    }
  } else {
    input.disabled = true
  }
}
