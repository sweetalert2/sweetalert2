import * as dom from '../../dom/index.js'

export const renderCloseButton = (params) => {
  const closeButton = dom.getCloseButton()

  // Custom class
  if (params.customClass) {
    dom.addClass(closeButton, params.customClass.closeButton)
  }

  dom.toggle(closeButton, params.showCloseButton)
  closeButton.setAttribute('aria-label', params.closeButtonAriaLabel)
}
