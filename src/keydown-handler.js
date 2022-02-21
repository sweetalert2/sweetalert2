import * as dom from './utils/dom/index.js'
import { DismissReason } from './utils/DismissReason.js'
import { callIfFunction } from './utils/utils.js'
import { clickConfirm } from './staticMethods/dom.js'
import privateProps from './privateProps.js'

export const addKeydownHandler = (instance, globalState, innerParams, dismissWith) => {
  if (globalState.keydownTarget && globalState.keydownHandlerAdded) {
    globalState.keydownTarget.removeEventListener('keydown', globalState.keydownHandler, {
      capture: globalState.keydownListenerCapture,
    })
    globalState.keydownHandlerAdded = false
  }

  if (!innerParams.toast) {
    globalState.keydownHandler = (e) => keydownHandler(instance, e, dismissWith)
    globalState.keydownTarget = innerParams.keydownListenerCapture ? window : dom.getPopup()
    globalState.keydownListenerCapture = innerParams.keydownListenerCapture
    globalState.keydownTarget.addEventListener('keydown', globalState.keydownHandler, {
      capture: globalState.keydownListenerCapture,
    })
    globalState.keydownHandlerAdded = true
  }
}

// Focus handling
export const setFocus = (innerParams, index, increment) => {
  const focusableElements = dom.getFocusableElements()
  // search for visible elements and select the next possible match
  if (focusableElements.length) {
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

const arrowKeysNextButton = ['ArrowRight', 'ArrowDown']

const arrowKeysPreviousButton = ['ArrowLeft', 'ArrowUp']

const keydownHandler = (instance, e, dismissWith) => {
  const innerParams = privateProps.innerParams.get(instance)

  if (!innerParams) {
    return // This instance has already been destroyed
  }

  // Ignore keydown during IME composition
  // https://developer.mozilla.org/en-US/docs/Web/API/Document/keydown_event#ignoring_keydown_during_ime_composition
  // https://github.com/sweetalert2/sweetalert2/issues/720
  // https://github.com/sweetalert2/sweetalert2/issues/2406
  if (e.isComposing || e.keyCode === 229) {
    return
  }

  if (innerParams.stopKeydownPropagation) {
    e.stopPropagation()
  }

  // ENTER
  if (e.key === 'Enter') {
    handleEnter(instance, e, innerParams)
  }

  // TAB
  else if (e.key === 'Tab') {
    handleTab(e, innerParams)
  }

  // ARROWS - switch focus between buttons
  else if ([...arrowKeysNextButton, ...arrowKeysPreviousButton].includes(e.key)) {
    handleArrows(e.key)
  }

  // ESC
  else if (e.key === 'Escape') {
    handleEsc(e, innerParams, dismissWith)
  }
}

const handleEnter = (instance, e, innerParams) => {
  // https://github.com/sweetalert2/sweetalert2/issues/2386
  if (!callIfFunction(innerParams.allowEnterKey)) {
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

  // Cycle to the next button
  if (!e.shiftKey) {
    setFocus(innerParams, btnIndex, 1)
  }

  // Cycle to the prev button
  else {
    setFocus(innerParams, btnIndex, -1)
  }

  e.stopPropagation()
  e.preventDefault()
}

const handleArrows = (key) => {
  const confirmButton = dom.getConfirmButton()
  const denyButton = dom.getDenyButton()
  const cancelButton = dom.getCancelButton()
  if (![confirmButton, denyButton, cancelButton].includes(document.activeElement)) {
    return
  }
  const sibling = arrowKeysNextButton.includes(key) ? 'nextElementSibling' : 'previousElementSibling'
  let buttonToFocus = document.activeElement
  for (let i = 0; i < dom.getActions().children.length; i++) {
    buttonToFocus = buttonToFocus[sibling]
    if (!buttonToFocus) {
      return
    }
    if (dom.isVisible(buttonToFocus) && buttonToFocus instanceof HTMLButtonElement) {
      break
    }
  }
  if (buttonToFocus instanceof HTMLButtonElement) {
    buttonToFocus.focus()
  }
}

const handleEsc = (e, innerParams, dismissWith) => {
  if (callIfFunction(innerParams.allowEscapeKey)) {
    e.preventDefault()
    dismissWith(DismissReason.esc)
  }
}
