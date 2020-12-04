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
    for (const attr in clickHandlers) {
      const template = el.getAttribute(attr)
      if (template) {
        return clickHandlers[attr].fire({ template })
      }
    }
    el = el.parentNode
    if (!el || !el.getAttribute) { // window.getAttribute is undefined
      break
    }
  }
}
