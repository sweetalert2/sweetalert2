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
  dom.setInnerHtml(loader, params.loaderHtml)
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

  // Buttons background colors
  if (params.confirmButtonColor) {
    confirmButton.style.backgroundColor = params.confirmButtonColor
    dom.addClass(confirmButton, swalClasses['default-outline'])
  }
  if (params.denyButtonColor) {
    denyButton.style.backgroundColor = params.denyButtonColor
    dom.addClass(denyButton, swalClasses['default-outline'])
  }
  if (params.cancelButtonColor) {
    cancelButton.style.backgroundColor = params.cancelButtonColor
    dom.addClass(cancelButton, swalClasses['default-outline'])
  }
}

/**
 * @param {HTMLElement} button
 * @param {'confirm' | 'deny' | 'cancel'} buttonType
 * @param {SweetAlertOptions} params
 */
function renderButton(button, buttonType, params) {
  dom.toggle(button, params[`show${capitalizeFirstLetter(buttonType)}Button`], 'inline-block')
  dom.setInnerHtml(button, params[`${buttonType}ButtonText`]) // Set caption text
  button.setAttribute('aria-label', params[`${buttonType}ButtonAriaLabel`]) // ARIA label

  // Add buttons custom classes
  button.className = swalClasses[buttonType]
  dom.applyCustomClass(button, params, `${buttonType}Button`)
  dom.addClass(button, params[`${buttonType}ButtonClass`])
}
