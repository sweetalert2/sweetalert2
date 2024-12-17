import { swalClasses } from '../../classes.js'
import { addDraggableListeners, removeDraggableListeners } from '../../draggable.js'
import * as dom from '../../dom/index.js'

/**
 * @param {SweetAlert} instance
 * @param {SweetAlertOptions} params
 */
export const renderPopup = (instance, params) => {
  const container = dom.getContainer()
  const popup = dom.getPopup()
  if (!container || !popup) {
    return
  }

  // Width
  // https://github.com/sweetalert2/sweetalert2/issues/2170
  if (params.toast) {
    dom.applyNumericalStyle(container, 'width', params.width)
    popup.style.width = '100%'
    const loader = dom.getLoader()
    if (loader) {
      popup.insertBefore(loader, dom.getIcon())
    }
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

  if (params.draggable && !params.toast) {
    dom.addClass(popup, swalClasses.draggable)
    addDraggableListeners(popup)
  } else {
    dom.removeClass(popup, swalClasses.draggable)
    removeDraggableListeners(popup)
  }
}

/**
 * @param {HTMLElement} popup
 * @param {SweetAlertOptions} params
 */
const addClasses = (popup, params) => {
  const showClass = params.showClass || {}
  // Default Class + showClass when updating Swal.update({})
  popup.className = `${swalClasses.popup} ${dom.isVisible(popup) ? showClass.popup : ''}`

  if (params.toast) {
    dom.addClass([document.documentElement, document.body], swalClasses['toast-shown'])
    dom.addClass(popup, swalClasses.toast)
  } else {
    dom.addClass(popup, swalClasses.modal)
  }

  // Custom class
  dom.applyCustomClass(popup, params, 'popup')
  // TODO: remove in the next major
  if (typeof params.customClass === 'string') {
    dom.addClass(popup, params.customClass)
  }

  // Icon class (#1842)
  if (params.icon) {
    dom.addClass(popup, swalClasses[`icon-${params.icon}`])
  }
}
