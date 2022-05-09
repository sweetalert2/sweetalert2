import { swalClasses } from '../../classes.js'
import * as dom from '../../dom/index.js'

/**
 * @typedef { import('sweetalert2') } SweetAlert2
 * @typedef { import('sweetalert2').SweetAlertOptions } SweetAlertOptions
 */

/**
 * @param {SweetAlert2} instance
 * @param {SweetAlertOptions} params
 */
export const renderPopup = (instance, params) => {
  const container = dom.getContainer()
  const popup = dom.getPopup()

  // Width
  // https://github.com/sweetalert2/sweetalert2/issues/2170
  if (params.toast) {
    dom.applyNumericalStyle(container, 'width', params.width)
    popup.style.width = '100%'
    popup.insertBefore(dom.getLoader(), dom.getIcon())
  } else {
    dom.applyNumericalStyle(popup, 'width', params.width)
  }

  // Padding
  dom.applyNumericalStyle(popup, 'padding', params.padding)

  // Color
  if (params.color) {
    popup.style.color = params.color
  }

  // Background
  if (params.background) {
    popup.style.background = params.background
  }

  dom.hide(dom.getValidationMessage())

  // Classes
  addClasses(popup, params)
}

/**
 * @param {HTMLElement} popup
 * @param {SweetAlertOptions} params
 */
const addClasses = (popup, params) => {
  // Default Class + showClass when updating Swal.update({})
  popup.className = `${swalClasses.popup} ${dom.isVisible(popup) ? params.showClass.popup : ''}`

  if (params.toast) {
    dom.addClass([document.documentElement, document.body], swalClasses['toast-shown'])
    dom.addClass(popup, swalClasses.toast)
  } else {
    dom.addClass(popup, swalClasses.modal)
  }

  // Custom class
  dom.applyCustomClass(popup, params, 'popup')
  if (typeof params.customClass === 'string') {
    dom.addClass(popup, params.customClass)
  }

  // Icon class (#1842)
  if (params.icon) {
    dom.addClass(popup, swalClasses[`icon-${params.icon}`])
  }
}
