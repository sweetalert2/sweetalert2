import * as dom from '../../dom/index.js'

export const renderTitle = (params) => {
  const title = dom.getTitle()

  dom.toggle(title, params.title || params.titleText)

  if (params.titleText) {
    title.innerText = params.titleText
  } else if (params.title) {
    if (typeof params.title === 'string') {
      params.title = params.title.split('\n').join('<br />')
    }
    dom.parseHtmlToContainer(params.title, title)
  }

  // Custom class
  if (params.customClass) {
    dom.addClass(title, params.customClass.title)
  }
}
