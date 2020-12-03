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
  for (const attr in clickHandlers) {
    if (checkAndFire(event.target, attr)) {
      // direct hit, there's data-swal-template="..." on event.target
      break
    }
    // check if data-swal-template="..." exists on event.target's ancestors
    chechEventPath(event, attr)
  }
}

/**
 * Check if element has data-swal-template="..." and if so, fire a popup
 */
const checkAndFire = (el, attr) => {
  if (!el.getAttribute) {
    return false
  }
  const template = el.getAttribute(attr)
  if (template) {
    clickHandlers[attr].fire({ template })
    return true
  }
  return false
}

/**
 * In cases like <button data-swal-template="..."><img> label</button> and user click on <img>,
 * event.target will be <img>, not <button>. Because of that we need to check the whole way that
 * event bubbles up through ancestors of the target element until the root element.
 */
const chechEventPath = (event, attr) => {
  const path = getPath(event)
  if (!path) {
    return
  }
  for (let i = 1; i < path.length; i++) {
    if (checkAndFire(path[i], attr)) {
      break
    }
  }
}

const getPath = (event) => event.path || (event.composedPath && event.composedPath())
