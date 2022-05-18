import * as dom from '../../dom/index.js'

/**
 * @param {SweetAlert2} instance
 * @param {SweetAlertOptions} params
 */
export const renderTitle = (instance, params) => {
  const title = dom.getTitle()

  dom.toggle(title, params.title || params.titleText, 'block')

  if (params.title) {
    dom.parseHtmlToContainer(params.title, title)
  }

  if (params.titleText) {
    title.innerText = params.titleText
  }

  // Custom class
  dom.applyCustomClass(title, params, 'title')
}
