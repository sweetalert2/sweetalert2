/* istanbul ignore file */
import * as dom from './dom/index.js'

// https://stackoverflow.com/a/21825207
const isIE11 = () => !!window.MSInputMethodContext && !!document.documentMode

// Fix IE11 centering sweetalert2/issues/933
const fixVerticalPositionIE = () => {
  const container = dom.getContainer()
  const popup = dom.getPopup()

  container.style.removeProperty('align-items')
  if (popup.offsetTop < 0) {
    container.style.alignItems = 'flex-start'
  }
}

export const IEfix = () => {
  if (typeof window !== 'undefined' && isIE11()) {
    fixVerticalPositionIE()
    window.addEventListener('resize', fixVerticalPositionIE)
  }
}

export const undoIEfix = () => {
  if (typeof window !== 'undefined' && isIE11()) {
    window.removeEventListener('resize', fixVerticalPositionIE)
  }
}
