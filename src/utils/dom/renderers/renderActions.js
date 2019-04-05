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

function renderButton (button, options) {
  dom.toggle(button, options.showButton, 'inline-block')
  button.innerHTML = options.buttonText // Set caption text
  button.setAttribute('aria-label', options.buttonAriaLabel) // ARIA label

  // Add buttons custom classes
  button.className = options.className
  dom.applyCustomClass(button, options.customClass, options.customClassName)
  dom.addClass(button, options.buttonClass)
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
  renderButton(confirmButton,
    {
      showButton: params.showConfirmButton,
      buttonText: params.confirmButtonText,
      buttonAriaLabel: params.confirmButtonAriaLabel,
      className: swalClasses.confirm,
      customClass: params.customClass,
      customClassName: 'confirmButton',
      buttonClass: params.confirmButtonClass
    }
  )
  // render Cancel Button
  renderButton(cancelButton,
    {
      showButton: params.showCancelButton,
      buttonText: params.cancelButtonText,
      buttonAriaLabel: params.cancelButtonAriaLabel,
      className: swalClasses.cancel,
      customClass: params.customClass,
      customClassName: 'cancelButton',
      buttonClass: params.cancelButtonClass
    }
  )

  if (params.buttonsStyling) {
    handleButtonsStyling(confirmButton, cancelButton, params)
  } else {
    dom.removeClass([confirmButton, cancelButton], swalClasses.styled)
    confirmButton.style.backgroundColor = confirmButton.style.borderLeftColor = confirmButton.style.borderRightColor = ''
    cancelButton.style.backgroundColor = cancelButton.style.borderLeftColor = cancelButton.style.borderRightColor = ''
  }
}
