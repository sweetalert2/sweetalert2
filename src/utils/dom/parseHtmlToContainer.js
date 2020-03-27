import { setInnerHtml } from './domUtils.js'

export const parseHtmlToContainer = (param, target) => {
  // DOM element
  if (param instanceof HTMLElement) {
    target.appendChild(param)

  // Object
  } else if (typeof param === 'object') {
    handleObject(param, target)

  // Plain string
  } else if (param) {
    setInnerHtml(target, param)
  }
}

const handleObject = (param, target) => {
  // JQuery element(s)
  if (param.jquery) {
    handleJqueryElem(target, param)

  // For other objects use their string representation
  } else {
    setInnerHtml(target, param.toString())
  }
}

const handleJqueryElem = (target, elem) => {
  target.textContent = ''
  if (0 in elem) {
    for (let i = 0; i in elem; i++) {
      target.appendChild(elem[i].cloneNode(true))
    }
  } else {
    target.appendChild(elem.cloneNode(true))
  }
}
