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
    // using .parentNode instead of event.path because of better support by old browsers
    // https://stackoverflow.com/a/39245638
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
  // using .parentNode instead of .parentElement because of IE11 + SVG
  // https://stackoverflow.com/a/36270354
  return el.parentNode
}
