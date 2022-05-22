import * as dom from '../../dom/index.js'

/**
 * @param {SweetAlert2} instance
 * @param {SweetAlertOptions} params
 */
export const renderFooter = (instance, params) => {
  const footer = dom.getFooter()

  dom.toggle(footer, params.footer)

  if (params.footer) {
    dom.parseHtmlToContainer(params.footer, footer)
  }

  // Custom class
  dom.applyCustomClass(footer, params, 'footer')
}
