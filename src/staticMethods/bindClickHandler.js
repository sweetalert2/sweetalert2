let bodyClickListenerAdded = false
const clickHandlers = {}

export function bindClickHandler (attr = 'data-swal-template') {
  clickHandlers[attr] = this

  if (!bodyClickListenerAdded) {
    document.body.addEventListener('click', bodyClickListener)
    bodyClickListenerAdded = true
  }
}

const bodyClickListener = (event) => {
  let el = event.target
  while (1) {
    el = checkElementAndGetItsParentNode(el)
    if (!el || !el.getAttribute) { // window.getAttribute is undefined
      break
    }
  }
}

const checkElementAndGetItsParentNode = (el) => {
  for (const attr in clickHandlers) {
    const template = el.getAttribute(attr)
    if (template) {
      clickHandlers[attr].fire({ template })
      return false
    }
  }
  return el.parentNode
}
