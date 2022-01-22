import { RESTORE_FOCUS_TIMEOUT } from './constants.js'

const globalState = {}

export default globalState

const focusPreviousActiveElement = () => {
  if (globalState.previousActiveElement && globalState.previousActiveElement.focus) {
    globalState.previousActiveElement.focus()
    globalState.previousActiveElement = null
  } else if (document.body) {
    document.body.focus()
  }
}

// Restore previous active (focused) element
export const restoreActiveElement = (returnFocus) => {
  return new Promise((resolve) => {
    if (!returnFocus) {
      return resolve()
    }
    const x = window.scrollX
    const y = window.scrollY

    globalState.restoreFocusTimeout = setTimeout(() => {
      focusPreviousActiveElement()
      resolve()
    }, RESTORE_FOCUS_TIMEOUT) // issues/900

    window.scrollTo(x, y)
  })
}
