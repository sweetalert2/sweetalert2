import { isVisible } from '../utils/dom/domUtils.js'
import { getInputValue } from '../utils/dom/inputUtils.js'
import { getDenyButton, getValidationMessage } from '../utils/dom/getters.js'
import { asPromise } from '../utils/utils.js'
import { showLoading } from '../staticMethods/showLoading.js'
import { DismissReason } from '../utils/DismissReason.js'

export const handleConfirmButtonClick = (instance, innerParams) => {
  instance.disableButtons()
  if (innerParams.input) {
    handleConfirmOrDenyWithInput(instance, innerParams, 'confirm')
  } else {
    confirm(instance, innerParams, true)
  }
}

export const handleDenyButtonClick = (instance, innerParams) => {
  instance.disableButtons()
  if (innerParams.returnInputValueOnDeny) {
    handleConfirmOrDenyWithInput(instance, innerParams, 'deny')
  } else {
    deny(instance, innerParams, false)
  }
}

export const handleCancelButtonClick = (instance, dismissWith) => {
  instance.disableButtons()
  dismissWith(DismissReason.cancel)
}

const handleConfirmOrDenyWithInput = (instance, innerParams, type /* type is either 'confirm' or 'deny' */) => {
  const inputValue = getInputValue(instance, innerParams)
  if (innerParams.inputValidator) {
    handleInputValidator(instance, innerParams, inputValue, type)
  } else if (!instance.getInput().checkValidity()) {
    instance.enableButtons()
    instance.showValidationMessage(innerParams.validationMessage)
  } else if (type === 'deny') {
    deny(instance, innerParams, inputValue)
  } else {
    confirm(instance, innerParams, inputValue)
  }
}

const handleInputValidator = (instance, innerParams, inputValue, type /* type is either 'confirm' or 'deny' */) => {
  instance.disableInput()
  const validationPromise = Promise.resolve().then(() => asPromise(
    innerParams.inputValidator(inputValue, innerParams.validationMessage))
  )
  validationPromise.then(
    (validationMessage) => {
      instance.enableButtons()
      instance.enableInput()
      if (validationMessage) {
        instance.showValidationMessage(validationMessage)
      } else if (type === 'deny') {
        deny(instance, innerParams, inputValue)
      } else {
        confirm(instance, innerParams, inputValue)
      }
    }
  )
}

const deny = (instance, innerParams, value) => {
  if (innerParams.showLoaderOnDeny) {
    showLoading(getDenyButton())
  }

  if (innerParams.preDeny) {
    const preDenyPromise = Promise.resolve().then(() => asPromise(
      innerParams.preDeny(value, innerParams.validationMessage))
    )
    preDenyPromise.then(
      (preDenyValue) => {
        if (preDenyValue === false) {
          instance.hideLoading()
        } else {
          instance.closePopup({ isDenied: true, value: typeof preDenyValue === 'undefined' ? value : preDenyValue })
        }
      }
    )
  } else {
    instance.closePopup({ isDenied: true, value })
  }
}

const succeedWith = (instance, value) => {
  instance.closePopup({ isConfirmed: true, value })
}

const confirm = (instance, innerParams, value) => {
  if (innerParams.showLoaderOnConfirm) {
    showLoading() // TODO: make showLoading an *instance* method
  }

  if (innerParams.preConfirm) {
    instance.resetValidationMessage()
    const preConfirmPromise = Promise.resolve().then(() => asPromise(
      innerParams.preConfirm(value, innerParams.validationMessage))
    )
    preConfirmPromise.then(
      (preConfirmValue) => {
        if (isVisible(getValidationMessage()) || preConfirmValue === false) {
          instance.hideLoading()
        } else {
          succeedWith(instance, typeof preConfirmValue === 'undefined' ? value : preConfirmValue)
        }
      }
    )
  } else {
    succeedWith(instance, value)
  }
}
