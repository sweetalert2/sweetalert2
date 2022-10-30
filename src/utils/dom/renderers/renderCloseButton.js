import * as dom from '../../dom/index.js'
import { swalClasses } from '../../classes.js'

/**
 * @param {SweetAlert2} instance
 * @param {SweetAlertOptions} params
 */
export const renderCloseButton = (instance, params) => {
  const popup = dom.getPopup()
  const closeButton = dom.getCloseButton()

  dom.setInnerHtml(closeButton, params.closeButtonHtml)

  dom.toggleClass(popup, swalClasses['with-close-button'], params.showCloseButton)

  // Custom class
  dom.applyCustomClass(closeButton, params, 'closeButton')

  dom.toggle(closeButton, params.showCloseButton)
  closeButton.setAttribute('aria-label', params.closeButtonAriaLabel)
}
