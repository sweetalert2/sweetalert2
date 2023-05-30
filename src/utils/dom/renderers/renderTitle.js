import * as dom from '../../dom/index.js'

/**
 * @param {SweetAlert} instance
 * @param {SweetAlertOptions} params
 */
export const renderTitle = (instance, params) => {
  const title = dom.getTitle()
  if (!title) {
    return
  }

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
