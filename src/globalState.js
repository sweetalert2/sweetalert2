const globalState = {}

export default globalState

// Reset previous window keydown handler and focued element
export const resetActiveElement = () => {
  if (globalState.previousActiveElement && globalState.previousActiveElement.focus) {
    let x = window.scrollX
    let y = window.scrollY
    setTimeout(() => {
      globalState.previousActiveElement.focus && globalState.previousActiveElement.focus()
    }, 100) // issues/900
    if (typeof x !== 'undefined' && typeof y !== 'undefined') { // IE doesn't have scrollX/scrollY support
      window.scrollTo(x, y)
    }
  }
}
