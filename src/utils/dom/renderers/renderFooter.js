import * as dom from '../../dom/index.js'

export const renderFooter = (params) => {
  const footer = dom.getFooter()

  dom.toggle(footer, params.footer)

  if (params.footer) {
    dom.parseHtmlToContainer(params.footer, footer)
  }

  // Custom class
  if (params.customClass) {
    dom.addClass(footer, params.customClass.footer)
  }
}
