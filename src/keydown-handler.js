import { clickConfirm } from './staticMethods/dom.js'
import { DismissReason } from './utils/DismissReason.js'
import * as dom from './utils/dom/index.js'
import { callIfFunction } from './utils/utils.js'

/**
 * @param {GlobalState} globalState
 */
export const removeKeydownHandler = (globalState) => {
  if (globalState.keydownTarget && globalState.keydownHandlerAdded) {
    globalState.keydownTarget.removeEventListener('keydown', globalState.keydownHandler, {
      capture: globalState.keydownListenerCapture,
    })
    globalState.keydownHandlerAdded = false
  }
}

/**
 * @param {GlobalState} globalState
 * @param {SweetAlertOptions} innerParams
 * @param {*} dismissWith
 */
export const addKeydownHandler = (globalState, innerParams, dismissWith) => {
  removeKeydownHandler(globalState)
  if (!innerParams.toast) {
    globalState.keydownHandler = (e) => keydownHandler(innerParams, e, dismissWith)
    globalState.keydownTarget = innerParams.keydownListenerCapture ? window : dom.getPopup()
    globalState.keydownListenerCapture = innerParams.keydownListenerCapture
    globalState.keydownTarget.addEventListener('keydown', globalState.keydownHandler, {
      capture: globalState.keydownListenerCapture,
    })
    globalState.keydownHandlerAdded = true
  }
}

/**
 * @param {number} index
 * @param {number} increment
 */
export const setFocus = (index, increment) => {
  const focusableElements = dom.getFocusableElements()
  // search for visible elements and select the next possible match
  if (focusableElements.length) {
    index = index + increment

    // shift + tab when .swal2-popup is focused
    if (index === -2) {
      index = focusableElements.length - 1
    }

    // rollover to first item
    if (index === focusableElements.length) {
      index = 0

      // go to last item
    } else if (index === -1) {
      index = focusableElements.length - 1
    }

    focusableElements[index].focus()
    return
  }
  // no visible focusable elements, focus the popup
  dom.getPopup()?.focus()
}

const arrowKeysNextButton = ['ArrowRight', 'ArrowDown']

const arrowKeysPreviousButton = ['ArrowLeft', 'ArrowUp']

/**
 * @param {SweetAlertOptions} innerParams
 * @param {KeyboardEvent} event
 * @param {Function} dismissWith
 */
const keydownHandler = (innerParams, event, dismissWith) => {
  if (!innerParams) {
    return // This instance has already been destroyed
  }

  // Ignore keydown during IME composition
  // https://developer.mozilla.org/en-US/docs/Web/API/Document/keydown_event#ignoring_keydown_during_ime_composition
  // https://github.com/sweetalert2/sweetalert2/issues/720
  // https://github.com/sweetalert2/sweetalert2/issues/2406
  if (event.isComposing || event.keyCode === 229) {
    return
  }

  if (innerParams.stopKeydownPropagation) {
    event.stopPropagation()
  }

  // ENTER
  if (event.key === 'Enter') {
    handleEnter(event, innerParams)
  }

  // TAB
  else if (event.key === 'Tab') {
    handleTab(event)
  }

  // ARROWS - switch focus between buttons
  else if ([...arrowKeysNextButton, ...arrowKeysPreviousButton].includes(event.key)) {
    handleArrows(event.key)
  }

  // ESC
  else if (event.key === 'Escape') {
    handleEsc(event, innerParams, dismissWith)
  }
}

/**
 * @param {KeyboardEvent} event
 * @param {SweetAlertOptions} innerParams
 */
const handleEnter = (event, innerParams) => {
  // https://github.com/sweetalert2/sweetalert2/issues/2386
  if (!callIfFunction(innerParams.allowEnterKey)) {
    return
  }

  const input = dom.getInput(dom.getPopup(), innerParams.input)

  if (event.target && input && event.target instanceof HTMLElement && event.target.outerHTML === input.outerHTML) {
    if (['textarea', 'file'].includes(innerParams.input)) {
      return // do not submit
    }

    clickConfirm()
    event.preventDefault()
  }
}

/**
 * @param {KeyboardEvent} event
 */
const handleTab = (event) => {
  const targetElement = event.target

  const focusableElements = dom.getFocusableElements()
  let btnIndex = -1
  for (let i = 0; i < focusableElements.length; i++) {
    if (targetElement === focusableElements[i]) {
      btnIndex = i
      break
    }
  }

  // Cycle to the next button
  if (!event.shiftKey) {
    setFocus(btnIndex, 1)
  }

  // Cycle to the prev button
  else {
    setFocus(btnIndex, -1)
  }

  event.stopPropagation()
  event.preventDefault()
}

/**
 * @param {string} key
 */
const handleArrows = (key) => {
  const actions = dom.getActions()
  const confirmButton = dom.getConfirmButton()
  const denyButton = dom.getDenyButton()
  const cancelButton = dom.getCancelButton()
  if (!actions || !confirmButton || !denyButton || !cancelButton) {
    return
  }
  /** @type HTMLElement[] */
  const buttons = [confirmButton, denyButton, cancelButton]
  if (document.activeElement instanceof HTMLElement && !buttons.includes(document.activeElement)) {
    return
  }
  const sibling = arrowKeysNextButton.includes(key) ? 'nextElementSibling' : 'previousElementSibling'
  let buttonToFocus = document.activeElement
  if (!buttonToFocus) {
    return
  }
  for (let i = 0; i < actions.children.length; i++) {
    buttonToFocus = buttonToFocus[sibling]
    if (!buttonToFocus) {
      return
    }
    if (buttonToFocus instanceof HTMLButtonElement && dom.isVisible(buttonToFocus)) {
      break
    }
  }
  if (buttonToFocus instanceof HTMLButtonElement) {
    buttonToFocus.focus()
  }
}

/**
 * @param {KeyboardEvent} event
 * @param {SweetAlertOptions} innerParams
 * @param {Function} dismissWith
 */
const handleEsc = (event, innerParams, dismissWith) => {
  event.preventDefault()
  if (callIfFunction(innerParams.allowEscapeKey)) {
    dismissWith(DismissReason.esc)
  }
}
