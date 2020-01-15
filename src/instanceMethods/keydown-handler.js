import * as dom from '../utils/dom/index.js'
import { DismissReason } from '../utils/DismissReason.js'
import { callIfFunction } from '../utils/utils.js'
import { clickConfirm } from '../staticMethods/dom.js'
import privateProps from '../privateProps.js'

export const addKeydownHandler = (instance, globalState, innerParams, dismissWith) => {
  if (globalState.keydownTarget && globalState.keydownHandlerAdded) {
    globalState.keydownTarget.removeEventListener('keydown', globalState.keydownHandler, { capture: globalState.keydownListenerCapture })
    globalState.keydownHandlerAdded = false
  }

  if (!innerParams.toast) {
    globalState.keydownHandler = (e) => keydownHandler(instance, e, dismissWith)
    globalState.keydownTarget = innerParams.keydownListenerCapture ? window : dom.getPopup()
    globalState.keydownListenerCapture = innerParams.keydownListenerCapture
    globalState.keydownTarget.addEventListener('keydown', globalState.keydownHandler, { capture: globalState.keydownListenerCapture })
    globalState.keydownHandlerAdded = true
  }
}

// Focus handling
export const setFocus = (innerParams, index, increment) => {
  const focusableElements = dom.getFocusableElements()
  // search for visible elements and select the next possible match
  for (let i = 0; i < focusableElements.length; i++) {
    index = index + increment

    // rollover to first item
    if (index === focusableElements.length) {
      index = 0

      // go to last item
    } else if (index === -1) {
      index = focusableElements.length - 1
    }

    return focusableElements[index].focus()
  }
  // no visible focusable elements, focus the popup
  dom.getPopup().focus()
}

const arrowKeys = [
  'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
  'Left', 'Right', 'Up', 'Down' // IE11
]

const escKeys = [
  'Escape',
  'Esc' // IE11
]

const keydownHandler = (instance, e, dismissWith) => {
  const innerParams = privateProps.innerParams.get(instance)

  if (innerParams.stopKeydownPropagation) {
    e.stopPropagation()
  }

  // ENTER
  if (e.key === 'Enter') {
    handleEnter(instance, e, innerParams)

  // TAB
  } else if (e.key === 'Tab') {
    handleTab(e, innerParams)

  // ARROWS - switch focus between buttons
  } else if (arrowKeys.includes(e.key)) {
    handleArrows()

  // ESC
  } else if (escKeys.includes(e.key)) {
    handleEsc(e, innerParams, dismissWith)
  }
}

const handleEnter = (instance, e, innerParams) => {
  // #720 #721
  if (e.isComposing) {
    return
  }

  if (e.target && instance.getInput() && e.target.outerHTML === instance.getInput().outerHTML) {
    if (['textarea', 'file'].includes(innerParams.input)) {
      return // do not submit
    }

    clickConfirm()
    e.preventDefault()
  }
}

const handleTab = (e, innerParams) => {
  const targetElement = e.target

  const focusableElements = dom.getFocusableElements()
  let btnIndex = -1
  for (let i = 0; i < focusableElements.length; i++) {
    if (targetElement === focusableElements[i]) {
      btnIndex = i
      break
    }
  }

  if (!e.shiftKey) {
    // Cycle to the next button
    setFocus(innerParams, btnIndex, 1)
  } else {
    // Cycle to the prev button
    setFocus(innerParams, btnIndex, -1)
  }
  e.stopPropagation()
  e.preventDefault()
}

const handleArrows = () => {
  const confirmButton = dom.getConfirmButton()
  const cancelButton = dom.getCancelButton()
  // focus Cancel button if Confirm button is currently focused
  if (document.activeElement === confirmButton && dom.isVisible(cancelButton)) {
    cancelButton.focus()
    // and vice versa
  } else if (document.activeElement === cancelButton && dom.isVisible(confirmButton)) {
    confirmButton.focus()
  }
}

const handleEsc = (e, innerParams, dismissWith) => {
  if (callIfFunction(innerParams.allowEscapeKey)) {
    e.preventDefault()
    dismissWith(DismissReason.esc)
  }
}
