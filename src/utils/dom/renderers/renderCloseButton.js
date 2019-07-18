import * as dom from '../../dom/index.js'

export const renderCloseButton = (instance, params) => {
  const closeButton = dom.getCloseButton()

  closeButton.innerHTML = params.closeButtonHtml

  // Custom class
  dom.applyCustomClass(closeButton, params.customClass, 'closeButton')

  dom.toggle(closeButton, params.showCloseButton)
  closeButton.setAttribute('aria-label', params.closeButtonAriaLabel)
}
