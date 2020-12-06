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
  // 1. using .parentNode instead of event.path because of better support by old browsers https://stackoverflow.com/a/39245638
  // 2. using .parentNode instead of .parentElement because of IE11 + SVG https://stackoverflow.com/a/36270354
  for (let el = event.target; el && el !== document; el = el.parentNode) {
    for (const attr in clickHandlers) {
      const template = el.getAttribute(attr)
      if (template) {
        clickHandlers[attr].fire({ template })
        return
      }
    }
  }
}
