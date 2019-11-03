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

function removePopupAndResetState (instance, container, isToast, onAfterClose) {
  if (isToast) {
    triggerOnAfterCloseAndDispose(instance, onAfterClose)
  } else {
    restoreActiveElement().then(() => triggerOnAfterCloseAndDispose(instance, onAfterClose))
    globalState.keydownTarget.removeEventListener('keydown', globalState.keydownHandler, { capture: globalState.keydownListenerCapture })
    globalState.keydownHandlerAdded = false
  }

  if (container.parentNode) {
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

function disposeSwal (instance) {
  // Unset this.params so GC will dispose it (#1569)
  delete instance.params
  // Unset globalState props so GC will dispose globalState (#1569)
  delete globalState.keydownHandler
  delete globalState.keydownTarget
  // Unset WeakMaps so GC will be able to dispose them (#1569)
  unsetWeakMaps(privateProps)
  unsetWeakMaps(privateMethods)
}

export function close (resolveValue) {
  const popup = dom.getPopup()

  if (!popup) {
    return
  }

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
  swalPromiseResolve(resolveValue || {})
}

const handlePopupAnimation = (instance, popup, innerParams) => {
  const container = dom.getContainer()
  // If animation is supported, animate
  const animationIsSupported = dom.animationEndEvent && dom.hasCssAnimation(popup)

  const { onClose, onAfterClose } = innerParams

  if (onClose !== null && typeof onClose === 'function') {
    onClose(popup)
  }

  if (animationIsSupported) {
    animatePopup(instance, popup, container, onAfterClose)
  } else {
    // Otherwise, remove immediately
    removePopupAndResetState(instance, container, dom.isToast(), onAfterClose)
  }
}

const animatePopup = (instance, popup, container, onAfterClose) => {
  globalState.swalCloseEventFinishedCallback = removePopupAndResetState.bind(null, instance, container, dom.isToast(), onAfterClose)
  popup.addEventListener(dom.animationEndEvent, function (e) {
    if (e.target === popup) {
      globalState.swalCloseEventFinishedCallback()
      delete globalState.swalCloseEventFinishedCallback
    }
  })
}

const unsetWeakMaps = (obj) => {
  for (const i in obj) {
    obj[i] = new WeakMap()
  }
}

const triggerOnAfterCloseAndDispose = (instance, onAfterClose) => {
  setTimeout(() => {
    if (onAfterClose !== null && typeof onAfterClose === 'function') {
      onAfterClose()
    }
    if (!dom.getPopup()) {
      disposeSwal(instance)
    }
  })
}

export {
  close as closePopup,
  close as closeModal,
  close as closeToast
}
