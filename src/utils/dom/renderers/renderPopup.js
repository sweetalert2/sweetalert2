import { swalClasses } from '../../classes.js'
import * as dom from '../../dom/index.js'

export const renderPopup = (instance, params) => {
  const container = dom.getContainer()
  const popup = dom.getPopup()

  // Width
  if (params.toast) { // #2170
    dom.applyNumericalStyle(container, 'width', params.width)
    popup.style.width = '100%'
  } else {
    dom.applyNumericalStyle(popup, 'width', params.width)
  }

  // Padding
  dom.applyNumericalStyle(popup, 'padding', params.padding)

  // Background
  if (params.background) {
    popup.style.background = params.background
  }

  // Classes
  addClasses(popup, params)
}

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
