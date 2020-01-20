export const parseHtmlToContainer = (param, target) => {
  // DOM element
  if (param instanceof HTMLElement) {
    target.appendChild(param)

  // Object
  } else if (typeof param === 'object') {
    // JQuery element(s)
    if (param.jquery) {
      handleJqueryElem(target, param)

    // For other objects use their string representation
    } else {
      target.innerHTML = param.toString()
    }

  // Plain string
  } else if (param) {
    target.innerHTML = param
  }
}

const handleJqueryElem = (target, elem) => {
  target.innerHTML = ''
  if (0 in elem) {
    for (let i = 0; i in elem; i++) {
      target.appendChild(elem[i].cloneNode(true))
    }
  } else {
    target.appendChild(elem.cloneNode(true))
  }
}
