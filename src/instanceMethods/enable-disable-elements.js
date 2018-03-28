export function enableButtons () {
  this._domCache.confirmButton.disabled = false
  this._domCache.cancelButton.disabled = false
}

export function disableButtons () {
  this._domCache.confirmButton.disabled = true
  this._domCache.cancelButton.disabled = true
}

export function enableConfirmButton () {
  this._domCache.confirmButton.disabled = false
}

export function disableConfirmButton () {
  this._domCache.confirmButton.disabled = true
}

export function enableInput () {
  const input = this.getInput()
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
  const input = this.getInput()
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
