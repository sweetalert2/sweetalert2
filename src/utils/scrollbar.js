import { swalClasses } from './classes.js'

/**
 * Measure scrollbar width for padding body during modal show/hide
 * https://github.com/twbs/bootstrap/blob/master/js/src/modal.js
 *
 * @returns {number}
 */
export const measureScrollbar = () => {
  const scrollDiv = document.createElement('div')
  scrollDiv.className = swalClasses['scrollbar-measure']
  document.body.appendChild(scrollDiv)
  const scrollbarWidth = scrollDiv.getBoundingClientRect().width - scrollDiv.clientWidth
  document.body.removeChild(scrollDiv)
  return scrollbarWidth
}

/**
 * Remember state in cases where opening and handling a modal will fiddle with it.
 * @type {number | null}
 */
let previousBodyPadding = null

/**
 * @param {string} initialBodyOverflow
 */
export const replaceScrollbarWithPadding = (initialBodyOverflow) => {
  // for queues, do not do this more than once
  if (previousBodyPadding !== null) {
    return
  }
  // if the body has overflow
  if (
    document.body.scrollHeight > window.innerHeight ||
    initialBodyOverflow === 'scroll' // https://github.com/sweetalert2/sweetalert2/issues/2663
  ) {
    // add padding so the content doesn't shift after removal of scrollbar
    previousBodyPadding = parseInt(window.getComputedStyle(document.body).getPropertyValue('padding-right'))
    document.body.style.paddingRight = `${previousBodyPadding + measureScrollbar()}px`
  }
}

export const undoReplaceScrollbarWithPadding = () => {
  if (previousBodyPadding !== null) {
    document.body.style.paddingRight = `${previousBodyPadding}px`
    previousBodyPadding = null
  }
}
