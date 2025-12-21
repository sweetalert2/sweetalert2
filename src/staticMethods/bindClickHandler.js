let bodyClickListenerAdded = false
/** @type {Record<string, any>} */
const clickHandlers = {}

/**
 * @this {any}
 * @param {string} attr
 */
export function bindClickHandler(attr = 'data-swal-template') {
  clickHandlers[attr] = this

  if (!bodyClickListenerAdded) {
    document.body.addEventListener('click', bodyClickListener)
    bodyClickListenerAdded = true
  }
}

/**
 * @param {MouseEvent} event
 */
const bodyClickListener = (event) => {
  for (let el = /** @type {any} */ (event.target); el && el !== document; el = el.parentNode) {
    for (const attr in clickHandlers) {
      const template = el.getAttribute && el.getAttribute(attr)
      if (template) {
        clickHandlers[attr].fire({ template })
        return
      }
    }
  }
}
