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

function removePopupAndResetState (instance, container, returnFocus, didClose) {
  if (dom.isToast()) {
    triggerDidCloseAndDispose(instance, didClose)
  } else {
    restoreActiveElement(returnFocus).then(() => triggerDidCloseAndDispose(instance, didClose))
    globalState.keydownTarget.removeEventListener('keydown', globalState.keydownHandler, { capture: globalState.keydownListenerCapture })
    globalState.keydownHandlerAdded = false
  }

  if (container.parentNode && !document.body.getAttribute('data-swal2-queue-step')) {
    container.parentNode.removeChild(container)
  }

  if (dom.isModal()) {
    undoScrollbar()
    undoIOSfix()
    undoIEfix()
    unsetAriaHidden()
  }

  removeBodyClasses()
}

function removeBodyClasses () {
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
}

export function close (resolveValue) {
  const popup = dom.getPopup()

  if (!popup) {
    return
  }

  resolveValue = prepareResolveValue(resolveValue)

  const innerParams = privateProps.innerParams.get(this)
  if (!innerParams || dom.hasClass(popup, innerParams.hideClass.popup)) {
    return
  }
  const swalPromiseResolve = privateMethods.swalPromiseResolve.get(this)

  dom.removeClass(popup, innerParams.showClass.popup)
  dom.addClass(popup, innerParams.hideClass.popup)

  const backdrop = dom.getContainer()
  dom.removeClass(backdrop, innerParams.showClass.backdrop)
  dom.addClass(backdrop, innerParams.hideClass.backdrop)

  handlePopupAnimation(this, popup, innerParams)

  // Resolve Swal promise
  swalPromiseResolve(resolveValue)
}

const prepareResolveValue = (resolveValue) => {
  // When user calls Swal.close()
  if (typeof resolveValue === 'undefined') {
    return {
      isConfirmed: false,
      isDenied: false,
      isDismissed: true,
    }
  }

  return Object.assign({
    isConfirmed: false,
    isDenied: false,
    isDismissed: false,
  }, resolveValue)
}

const handlePopupAnimation = (instance, popup, innerParams) => {
  const container = dom.getContainer()
  // If animation is supported, animate
  const animationIsSupported = dom.animationEndEvent && dom.hasCssAnimation(popup)

  const {
    onClose, onAfterClose, // @deprecated
    willClose, didClose
  } = innerParams

  runDidClose(popup, willClose, onClose)

  if (animationIsSupported) {
    animatePopup(instance, popup, container, innerParams.returnFocus, didClose || onAfterClose)
  } else {
    // Otherwise, remove immediately
    removePopupAndResetState(instance, container, innerParams.returnFocus, didClose || onAfterClose)
  }
}

const runDidClose = (popup, willClose, onClose) => {
  if (willClose !== null && typeof willClose === 'function') {
    willClose(popup)
  } else if (onClose !== null && typeof onClose === 'function') {
    onClose(popup) // @deprecated
  }
}

const animatePopup = (instance, popup, container, returnFocus, didClose) => {
  globalState.swalCloseEventFinishedCallback = removePopupAndResetState.bind(null, instance, container, returnFocus, didClose)
  popup.addEventListener(dom.animationEndEvent, function (e) {
    if (e.target === popup) {
      globalState.swalCloseEventFinishedCallback()
      delete globalState.swalCloseEventFinishedCallback
    }
  })
}

const triggerDidCloseAndDispose = (instance, didClose) => {
  setTimeout(() => {
    if (typeof didClose === 'function') {
      didClose()
    }
    instance._destroy()
  })
}

export {
  close as closePopup,
  close as closeModal,
  close as closeToast
}
