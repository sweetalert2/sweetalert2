import { show, hide } from './domUtils'

export const parseHtmlToContainer = (param, target) => {
  if (!param) {
    return hide(target)
  }

  if (typeof param === 'object') {
    target.innerHTML = ''
    if (0 in param) {
      for (let i = 0; i in param; i++) {
        target.appendChild(param[i].cloneNode(true))
      }
    } else {
      target.appendChild(param.cloneNode(true))
    }
  } else if (param) {
    target.innerHTML = param
  }
  show(target)
}
