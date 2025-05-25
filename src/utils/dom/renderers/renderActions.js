import { swalClasses } from '../../classes.js'
import * as dom from '../../dom/index.js'
import { capitalizeFirstLetter } from '../../utils.js'

/**
 * @param {SweetAlert} instance
 * @param {SweetAlertOptions} params
 */
export const renderActions = (instance, params) => {
  const actions = dom.getActions()
  const loader = dom.getLoader()
  if (!actions || !loader) {
    return
  }

  // Actions (buttons) wrapper
  if (!params.showConfirmButton && !params.showDenyButton && !params.showCancelButton) {
    dom.hide(actions)
  } else {
    dom.show(actions)
  }

  // Custom class
  dom.applyCustomClass(actions, params, 'actions')

  // Render all the buttons
  renderButtons(actions, loader, params)

  // Loader
  dom.setInnerHtml(loader, params.loaderHtml || '')
  dom.applyCustomClass(loader, params, 'loader')
}

/**
 * @param {HTMLElement} actions
 * @param {HTMLElement} loader
 * @param {SweetAlertOptions} params
 */
function renderButtons(actions, loader, params) {
  const confirmButton = dom.getConfirmButton()
  const denyButton = dom.getDenyButton()
  const cancelButton = dom.getCancelButton()
  if (!confirmButton || !denyButton || !cancelButton) {
    return
  }

  // Render buttons
  renderButton(confirmButton, 'confirm', params)
  renderButton(denyButton, 'deny', params)
  renderButton(cancelButton, 'cancel', params)
  handleButtonsStyling(confirmButton, denyButton, cancelButton, params)

  if (params.reverseButtons) {
    if (params.toast) {
      actions.insertBefore(cancelButton, confirmButton)
      actions.insertBefore(denyButton, confirmButton)
    } else {
      actions.insertBefore(cancelButton, loader)
      actions.insertBefore(denyButton, loader)
      actions.insertBefore(confirmButton, loader)
    }
  }
}

/**
 * @param {HTMLElement} confirmButton
 * @param {HTMLElement} denyButton
 * @param {HTMLElement} cancelButton
 * @param {SweetAlertOptions} params
 */
function handleButtonsStyling(confirmButton, denyButton, cancelButton, params) {
  if (!params.buttonsStyling) {
    dom.removeClass([confirmButton, denyButton, cancelButton], swalClasses.styled)
    return
  }

  dom.addClass([confirmButton, denyButton, cancelButton], swalClasses.styled)

  // Apply custom background colors to action buttons
  if (params.confirmButtonColor) {
    confirmButton.style.setProperty('--swal2-confirm-button-background-color', params.confirmButtonColor)
  }
  if (params.denyButtonColor) {
    denyButton.style.setProperty('--swal2-deny-button-background-color', params.denyButtonColor)
  }
  if (params.cancelButtonColor) {
    cancelButton.style.setProperty('--swal2-cancel-button-background-color', params.cancelButtonColor)
  }

  // Apply the outline color to action buttons
  applyOutlineColor(confirmButton)
  applyOutlineColor(denyButton)
  applyOutlineColor(cancelButton)
}

/**
 * @param {HTMLElement} button
 */
function applyOutlineColor(button) {
  const buttonStyle = window.getComputedStyle(button)
  if (buttonStyle.getPropertyValue('--swal2-action-button-focus-box-shadow')) {
    // If the button already has a custom outline color, no need to change it
    return
  }
  const outlineColor = buttonStyle.backgroundColor.replace(/rgba?\((\d+), (\d+), (\d+).*/, 'rgba($1, $2, $3, 0.5)')
  button.style.setProperty(
    '--swal2-action-button-focus-box-shadow',
    buttonStyle.getPropertyValue('--swal2-outline').replace(/ rgba\(.*/, ` ${outlineColor}`)
  )
}

/**
 * @param {HTMLElement} button
 * @param {'confirm' | 'deny' | 'cancel'} buttonType
 * @param {SweetAlertOptions} params
 */
function renderButton(button, buttonType, params) {
  const buttonName = /** @type {'Confirm' | 'Deny' | 'Cancel'} */ (capitalizeFirstLetter(buttonType))

  dom.toggle(button, params[`show${buttonName}Button`], 'inline-block')
  dom.setInnerHtml(button, params[`${buttonType}ButtonText`] || '') // Set caption text
  button.setAttribute('aria-label', params[`${buttonType}ButtonAriaLabel`] || '') // ARIA label

  // Add buttons custom classes
  button.className = swalClasses[buttonType]
  dom.applyCustomClass(button, params, `${buttonType}Button`)
}
