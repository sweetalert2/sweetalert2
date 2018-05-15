const globalState = {}

export default globalState

// Restore previous active (focused) element
export const restoreActiveElement = () => {
  if (globalState.previousActiveElement && globalState.previousActiveElement.focus) {
    const previousActiveElement = globalState.previousActiveElement
    globalState.previousActiveElement = null
    const x = window.scrollX
    const y = window.scrollY
    setTimeout(() => {
      previousActiveElement.focus && previousActiveElement.focus()
    }, 100) // issues/900
    if (typeof x !== 'undefined' && typeof y !== 'undefined') { // IE doesn't have scrollX/scrollY support
      window.scrollTo(x, y)
    }
  }
}
