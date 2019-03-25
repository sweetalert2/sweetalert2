export const parseHtmlToContainer = (param, target) => {
  // DOM element
  if (param instanceof HTMLElement) {
    target.appendChild(param)
  // JQuery element(s)
  } else if (typeof param === 'object') {
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
}
