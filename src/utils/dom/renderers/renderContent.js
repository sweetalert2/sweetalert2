import * as dom from '../../dom/index.js'
import { renderInput } from './renderInput.js'

export const renderContent = (instance, params) => {
  const htmlContainer = dom.getHtmlContainer()

  dom.applyCustomClass(htmlContainer, params, 'htmlContainer')

  // Content as HTML
  if (params.html) {
    dom.parseHtmlToContainer(params.html, htmlContainer)
    dom.show(htmlContainer, 'block')

  // Content as plain text
  } else if (params.text) {
    htmlContainer.textContent = params.text
    dom.show(htmlContainer, 'block')

  // No content
  } else {
    dom.hide(htmlContainer)
  }

  renderInput(instance, params)
}
