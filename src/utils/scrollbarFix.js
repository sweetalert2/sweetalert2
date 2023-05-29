import { measureScrollbar } from './dom/measureScrollbar.js'

/**
 * Remember state in cases where opening and handling a modal will fiddle with it.
 * @type {number | null}
 */
let previousBodyPadding = null

export const fixScrollbar = () => {
  // for queues, do not do this more than once
  if (previousBodyPadding !== null) {
    return
  }
  // if the body has overflow
  if (document.body.scrollHeight > window.innerHeight) {
    // add padding so the content doesn't shift after removal of scrollbar
    previousBodyPadding = parseInt(window.getComputedStyle(document.body).getPropertyValue('padding-right'))
    document.body.style.paddingRight = `${previousBodyPadding + measureScrollbar()}px`
  }
}

export const undoScrollbar = () => {
  if (previousBodyPadding !== null) {
    document.body.style.paddingRight = `${previousBodyPadding}px`
    previousBodyPadding = null
  }
}
