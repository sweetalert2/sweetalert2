import { swalClasses } from '../../classes.js'
import * as dom from '../../dom/index.js'

function handleButtonsStyling (confirmButton, cancelButton, params) {
  dom.addClass([confirmButton, cancelButton], swalClasses.styled)

  // Buttons background colors
  if (params.confirmButtonColor) {
    confirmButton.style.backgroundColor = params.confirmButtonColor
  }
  if (params.cancelButtonColor) {
    cancelButton.style.backgroundColor = params.cancelButtonColor
  }

  // Loading state
  const confirmButtonBackgroundColor = window.getComputedStyle(confirmButton).getPropertyValue('background-color')
  confirmButton.style.borderLeftColor = confirmButtonBackgroundColor
  confirmButton.style.borderRightColor = confirmButtonBackgroundColor
}

function renderButton (button, showButton, buttonText, buttonAriaLabel, className, customClass, customClassName, buttonClass) {
  dom.toggle(button, showButton, 'inline-block')
  button.innerHTML = buttonText // Set caption text
  button.setAttribute('aria-label', buttonAriaLabel) // ARIA label

  // Add buttons custom classes
  button.className = className
  dom.applyCustomClass(button, customClass, customClassName)
  dom.addClass(button, buttonClass)
}

export const renderActions = (params) => {
  const actions = dom.getActions()
  const confirmButton = dom.getConfirmButton()
  const cancelButton = dom.getCancelButton()

  // Actions (buttons) wrapper
  if (!params.showConfirmButton && !params.showCancelButton) {
    dom.hide(actions)
  } else {
    dom.show(actions)
  }

  // Custom class
  dom.applyCustomClass(actions, params.customClass, 'actions')

  // Render confirm button
  renderButton(confirmButton, params.showConfirmButton, params.confirmButtonText, params.confirmButtonAriaLabel, swalClasses.confirm, params.customClass, 'confirmButton', params.confirmButtonClass)
  // render Cancel Button
  renderButton(cancelButton, params.showCancelButton, params.cancelButtonText, params.cancelButtonAriaLabel, swalClasses.cancel, params.customClass, 'cancelButton', params.cancelButtonClass)

  if (params.buttonsStyling) {
    handleButtonsStyling(confirmButton, cancelButton, params)
  } else {
    dom.removeClass([confirmButton, cancelButton], swalClasses.styled)
    confirmButton.style.backgroundColor = confirmButton.style.borderLeftColor = confirmButton.style.borderRightColor = ''
    cancelButton.style.backgroundColor = cancelButton.style.borderLeftColor = cancelButton.style.borderRightColor = ''
  }
}
