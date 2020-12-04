let clickHandlerAdded = false
const clickHandlers = {}

export function bindClickHandler (attr = 'data-swal-template') {
  clickHandlers[attr] = this

  if (!clickHandlerAdded) {
    document.body.addEventListener('click', bodyClickListener)
    clickHandlerAdded = true
  }
}

const bodyClickListener = (event) => {
  let el = event.target
  while (1) {
    el = checkAndGetParentNode(el)
    if (!el || !el.getAttribute) { // window.getAttribute is undefined
      break
    }
  }
}

const checkAndGetParentNode = (el) => {
  for (const attr in clickHandlers) {
    const template = el.getAttribute(attr)
    if (template) {
      clickHandlers[attr].fire({ template })
      return false
    }
  }
  return el.parentNode
}
