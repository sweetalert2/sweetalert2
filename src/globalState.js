const globalState = {}

export default globalState

// Restore previous active (focused) element
export const restoreActiveElement = () => {
  if (globalState.previousActiveElement && globalState.previousActiveElement.focus) {
    const x = window.scrollX
    const y = window.scrollY
    globalState.restoreFocusTimeout = setTimeout(() => {
      globalState.previousActiveElement.focus()
      globalState.previousActiveElement = null
    }, 100) // issues/900
    if (typeof x !== 'undefined' && typeof y !== 'undefined') { // IE doesn't have scrollX/scrollY support
      window.scrollTo(x, y)
    }
  }
}
