import { isVisible } from '../utils/dom/domUtils.js'
import { getInputValue } from '../utils/dom/inputUtils.js'
import { getValidationMessage } from '../utils/dom/getters.js'
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
  // here we could add preDeny in future, if needed
  if (innerParams.returnInputValueOnDeny) {
    handleConfirmOrDenyWithInput(instance, innerParams, 'deny')
  } else {
    deny(instance, false)
  }
}

export const handleCancelButtonClick = (instance, dismissWith) => {
  instance.disableButtons()
  dismissWith(DismissReason.cancel)
}

const handleConfirmOrDenyWithInput = (instance, innerParams, type /* type is either 'confirm' or 'deny' */) => {
  const inputValue = getInputValue(instance, innerParams)
  if (innerParams.inputValidator) {
    handleInputValidator(instance, innerParams, inputValue)
  } else if (!instance.getInput().checkValidity()) {
    instance.enableButtons()
    instance.showValidationMessage(innerParams.validationMessage)
  } else if (type === 'deny') {
    deny(instance, inputValue)
  } else {
    confirm(instance, innerParams, inputValue)
  }
}

const handleInputValidator = (instance, innerParams, inputValue) => {
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
      } else {
        confirm(instance, innerParams, inputValue)
      }
    }
  )
}

const deny = (instance, value) => {
  instance.closePopup({ isDenied: true, value })
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
