import { handleAwaitingPromise } from './instanceMethods/close.js'
import privateProps from './privateProps.js'
import { showLoading } from './staticMethods/showLoading.js'
import { swalClasses } from './utils/classes.js'
import { DismissReason } from './utils/DismissReason.js'
import { isVisible } from './utils/dom/domUtils.js'
import { getDenyButton, getPopup, getValidationMessage } from './utils/dom/getters.js'
import { getInputValue } from './utils/dom/inputUtils.js'
import { asPromise, capitalizeFirstLetter, error } from './utils/utils.js'

/**
 * @param {SweetAlert} instance
 */
export const handleConfirmButtonClick = (instance) => {
  const innerParams = privateProps.innerParams.get(instance)
  instance.disableButtons()
  if (innerParams.input || innerParams.multipleInputs) {
    handleConfirmOrDenyWithInput(instance, 'confirm')
  } else {
    confirm(instance, true)
  }
}

/**
 * @param {SweetAlert} instance
 */
export const handleDenyButtonClick = (instance) => {
  const innerParams = privateProps.innerParams.get(instance)
  instance.disableButtons()
  if (innerParams.returnInputValueOnDeny) {
    handleConfirmOrDenyWithInput(instance, 'deny')
  } else {
    deny(instance, false)
  }
}

/**
 * @param {SweetAlert} instance
 * @param {(dismiss: DismissReason) => void} dismissWith
 */
export const handleCancelButtonClick = (instance, dismissWith) => {
  instance.disableButtons()
  dismissWith(DismissReason.cancel)
}

/**
 * @param {SweetAlert} instance
 * @param {'confirm' | 'deny'} type
 */
const handleConfirmOrDenyWithInput = (instance, type) => {
  const innerParams = privateProps.innerParams.get(instance)
  if (!innerParams.input && !innerParams.multipleInputs) {
    error(`The "input" parameter is needed to be set when using returnInputValueOn${capitalizeFirstLetter(type)}`)
    return
  }
  const inputValue = getInputValue(instance, innerParams)
  if (innerParams.inputValidator) {
    handleInputValidator(instance, inputValue, type)
  } else if (innerParams.multipleInputs) {
    // For multiple inputs, check validity of all inputs
    const allValid = checkMultipleInputsValidity(instance, innerParams)
    if (!allValid) {
      return
    }
    if (type === 'deny') {
      deny(instance, inputValue)
    } else {
      confirm(instance, inputValue)
    }
  } else {
    const input = instance.getInput()
    if (input && !input.checkValidity()) {
      instance.enableButtons()
      instance.showValidationMessage(innerParams.validationMessage || input.validationMessage)
    } else if (type === 'deny') {
      deny(instance, inputValue)
    } else {
      confirm(instance, inputValue)
    }
  }
}

/**
 * @param {SweetAlert} instance
 * @param {SweetAlertOptions} innerParams
 * @returns {boolean}
 */
const checkMultipleInputsValidity = (instance, innerParams) => {
  const popup = getPopup()
  if (!popup) {
    return true
  }
  const container = popup.querySelector(`.${swalClasses['multiple-inputs']}`)
  if (!container) {
    return true
  }
  const inputs = container.querySelectorAll('input, textarea, select')
  for (let i = 0; i < inputs.length; i++) {
    const input = /** @type {HTMLInputElement} */ (inputs[i])
    if (!input.checkValidity()) {
      instance.enableButtons()
      instance.showValidationMessage(innerParams.validationMessage || input.validationMessage)
      return false
    }
  }
  return true
}

/**
 * @param {SweetAlert} instance
 * @param {SweetAlertInputValue} inputValue
 * @param {'confirm' | 'deny'} type
 */
const handleInputValidator = (instance, inputValue, type) => {
  const innerParams = privateProps.innerParams.get(instance)
  instance.disableInput()
  const validationPromise = Promise.resolve().then(() =>
    asPromise(innerParams.inputValidator(inputValue, innerParams.validationMessage))
  )
  validationPromise.then((validationMessage) => {
    instance.enableButtons()
    instance.enableInput()
    if (validationMessage) {
      instance.showValidationMessage(validationMessage)
    } else if (type === 'deny') {
      deny(instance, inputValue)
    } else {
      confirm(instance, inputValue)
    }
  })
}

/**
 * @param {SweetAlert} instance
 * @param {*} value
 */
const deny = (instance, value) => {
  const innerParams = privateProps.innerParams.get(instance)

  if (innerParams.showLoaderOnDeny) {
    showLoading(getDenyButton())
  }

  if (innerParams.preDeny) {
    instance.isAwaitingPromise = true // Flagging the instance as awaiting a promise so it's own promise's reject/resolve methods doesn't get destroyed until the result from this preDeny's promise is received
    const preDenyPromise = Promise.resolve().then(() =>
      asPromise(innerParams.preDeny(value, innerParams.validationMessage))
    )
    preDenyPromise
      .then((preDenyValue) => {
        if (preDenyValue === false) {
          instance.hideLoading()
          handleAwaitingPromise(instance)
        } else {
          instance.close(
            /** @type SweetAlertResult */ ({
              isDenied: true,
              value: typeof preDenyValue === 'undefined' ? value : preDenyValue,
            })
          )
        }
      })
      .catch((error) => rejectWith(instance, error))
  } else {
    instance.close(/** @type SweetAlertResult */ ({ isDenied: true, value }))
  }
}

/**
 * @param {SweetAlert} instance
 * @param {*} value
 */
const succeedWith = (instance, value) => {
  instance.close(/** @type SweetAlertResult */ ({ isConfirmed: true, value }))
}

/**
 *
 * @param {SweetAlert} instance
 * @param {string} error
 */
const rejectWith = (instance, error) => {
  instance.rejectPromise(error)
}

/**
 *
 * @param {SweetAlert} instance
 * @param {*} value
 */
const confirm = (instance, value) => {
  const innerParams = privateProps.innerParams.get(instance)

  if (innerParams.showLoaderOnConfirm) {
    showLoading()
  }

  if (innerParams.preConfirm) {
    instance.resetValidationMessage()
    instance.isAwaitingPromise = true // Flagging the instance as awaiting a promise so it's own promise's reject/resolve methods doesn't get destroyed until the result from this preConfirm's promise is received
    const preConfirmPromise = Promise.resolve().then(() =>
      asPromise(innerParams.preConfirm(value, innerParams.validationMessage))
    )
    preConfirmPromise
      .then((preConfirmValue) => {
        if (isVisible(getValidationMessage()) || preConfirmValue === false) {
          instance.hideLoading()
          handleAwaitingPromise(instance)
        } else {
          succeedWith(instance, typeof preConfirmValue === 'undefined' ? value : preConfirmValue)
        }
      })
      .catch((error) => rejectWith(instance, error))
  } else {
    succeedWith(instance, value)
  }
}
