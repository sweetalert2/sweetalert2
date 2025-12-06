import globalState from '../globalState.js'
import * as dom from './dom/index.js'

let dragging = false
let mousedownX = 0
let mousedownY = 0
let initialX = 0
let initialY = 0

/**
 * @param {HTMLElement} popup
 */
export const addDraggableListeners = (popup) => {
  popup.addEventListener('mousedown', down)
  document.body.addEventListener('mousemove', move)
  popup.addEventListener('mouseup', up)

  popup.addEventListener('touchstart', down)
  document.body.addEventListener('touchmove', move)
  popup.addEventListener('touchend', up)
}

/**
 * @param {HTMLElement} popup
 */
export const removeDraggableListeners = (popup) => {
  popup.removeEventListener('mousedown', down)
  document.body.removeEventListener('mousemove', move)
  popup.removeEventListener('mouseup', up)

  popup.removeEventListener('touchstart', down)
  document.body.removeEventListener('touchmove', move)
  popup.removeEventListener('touchend', up)
}

/**
 * @param {MouseEvent | TouchEvent} event
 */
const down = (event) => {
  const popup = dom.getPopup()

  if (event.target === popup || dom.getIcon().contains(/** @type {HTMLElement} */ (event.target))) {
    dragging = true
    const clientXY = getClientXY(event)
    mousedownX = clientXY.clientX
    mousedownY = clientXY.clientY
    initialX = parseInt(popup.style.insetInlineStart) || 0
    initialY = parseInt(popup.style.insetBlockStart) || 0
    dom.addClass(popup, 'swal2-dragging')
  }
}

/**
 * @param {MouseEvent | TouchEvent} event
 */
const move = (event) => {
  const popup = dom.getPopup()

  if (dragging) {
    let { clientX, clientY } = getClientXY(event)
    const deltaX = clientX - mousedownX
    // In RTL mode, negate the horizontal delta since insetInlineStart refers to the right edge
    popup.style.insetInlineStart = `${initialX + (globalState.isRTL ? -deltaX : deltaX)}px`
    popup.style.insetBlockStart = `${initialY + (clientY - mousedownY)}px`
  }
}

const up = () => {
  const popup = dom.getPopup()

  dragging = false
  dom.removeClass(popup, 'swal2-dragging')
}

/**
 * @param {MouseEvent | TouchEvent} event
 * @returns {{ clientX: number, clientY: number }}
 */
const getClientXY = (event) => {
  let clientX = 0,
    clientY = 0
  if (event.type.startsWith('mouse')) {
    clientX = /** @type {MouseEvent} */ (event).clientX
    clientY = /** @type {MouseEvent} */ (event).clientY
  } else if (event.type.startsWith('touch')) {
    clientX = /** @type {TouchEvent} */ (event).touches[0].clientX
    clientY = /** @type {TouchEvent} */ (event).touches[0].clientY
  }
  return { clientX, clientY }
}
