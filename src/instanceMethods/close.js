import { undoScrollbar } from '../utils/scrollbarFix.js'
import { undoIOSfix } from '../utils/iosFix.js'
import { undoIEfix } from '../utils/ieFix.js'
import { unsetAriaHidden } from '../utils/aria.js'
import * as dom from '../utils/dom/index.js'
import { swalClasses } from '../utils/classes.js'
import globalState, { restoreActiveElement } from '../globalState.js'
import privateProps from '../privateProps.js'
import privateMethods from '../privateMethods.js'
/*
 * Instance method to close sweetAlert
 */

function removePopupAndResetState (container, onAfterClose) {
  if (!dom.isToast()) {
    restoreActiveElement().then(() => triggerOnAfterClose(onAfterClose))
    globalState.keydownTarget.removeEventListener('keydown', globalState.keydownHandler, { capture: globalState.keydownListenerCapture })
    globalState.keydownHandlerAdded = false
  } else {
    triggerOnAfterClose(onAfterClose)
  }

  if (container.parentNode) {
    container.parentNode.removeChild(container)
  }
  dom.removeClass(
    [document.documentElement, document.body],
    [
      swalClasses.shown,
      swalClasses['height-auto'],
      swalClasses['no-backdrop'],
      swalClasses['toast-shown'],
      swalClasses['toast-column']
    ]
  )

  if (dom.isModal()) {
    undoScrollbar()
    undoIOSfix()
    undoIEfix()
    unsetAriaHidden()
  }
}

function swalCloseEventFinished (popup, container, onAfterClose) {
  popup.removeEventListener(dom.animationEndEvent, swalCloseEventFinished)
  if (dom.hasClass(popup, swalClasses.hide)) {
    removePopupAndResetState(container, onAfterClose)
  }
}

export function close (resolveValue) {
  const container = dom.getContainer()
  const popup = dom.getPopup()
  const innerParams = privateProps.innerParams.get(this)
  const swalPromiseResolve = privateMethods.swalPromiseResolve.get(this)
  const onClose = innerParams.onClose
  const onAfterClose = innerParams.onAfterClose

  if (!popup) {
    return
  }

  if (onClose !== null && typeof onClose === 'function') {
    onClose(popup)
  }

  dom.removeClass(popup, swalClasses.show)
  dom.addClass(popup, swalClasses.hide)

  // If animation is supported, animate
  if (dom.animationEndEvent && !dom.hasClass(popup, swalClasses.noanimation)) {
    popup.addEventListener(dom.animationEndEvent, swalCloseEventFinished.bind(null, popup, container, onAfterClose))
  } else {
    // Otherwise, remove immediately
    removePopupAndResetState(container, onAfterClose)
  }

  // Resolve Swal promise
  swalPromiseResolve(resolveValue || {})
}

const triggerOnAfterClose = (onAfterClose) => {
  if (onAfterClose !== null && typeof onAfterClose === 'function') {
    setTimeout(() => {
      onAfterClose()
    })
  }
}

export {
  close as closePopup,
  close as closeModal,
  close as closeToast
}
