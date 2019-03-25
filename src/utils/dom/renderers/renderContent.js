import { swalClasses } from '../../classes.js'
import * as dom from '../../dom/index.js'

export const renderContent = (params) => {
  const content = dom.getContent().querySelector('#' + swalClasses.content)

  // Content as HTML
  if (params.html) {
    dom.parseHtmlToContainer(params.html, content)
    dom.show(content, 'block')

  // Content as plain text
  } else if (params.text) {
    content.textContent = params.text
    dom.show(content, 'block')

  // No content
  } else {
    dom.hide(content)
  }

  // Custom class
  if (params.customClass) {
    dom.addClass(dom.getContent(), params.customClass.content)
  }
}
