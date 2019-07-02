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

function removePopupAndResetState (container, isToast, onAfterClose) {
  if (isToast) {
    triggerOnAfterClose(onAfterClose)
  } else {
    restoreActiveElement().then(() => triggerOnAfterClose(onAfterClose))
    globalState.keydownTarget.removeEventListener('keydown', globalState.keydownHandler, { capture: globalState.keydownListenerCapture })
    globalState.keydownHandlerAdded = false
  }

  // Unset globalState props so GC will dispose globalState (#1569)
  delete globalState.keydownHandler
  delete globalState.keydownTarget

  if (container.parentNode) {
    container.parentNode.removeChild(container)
  }
  removeBodyClasses()

  if (dom.isModal()) {
    undoScrollbar()
    undoIOSfix()
    undoIEfix()
    unsetAriaHidden()
  }
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

function swalCloseEventFinished (popup, container, isToast, onAfterClose) {
  if (dom.hasClass(popup, swalClasses.hide)) {
    removePopupAndResetState(container, isToast, onAfterClose)
  }

  // Unset WeakMaps so GC will be able to dispose them (#1569)
  unsetWeakMaps(privateProps)
  unsetWeakMaps(privateMethods)
}

export function close (resolveValue) {
  
  const popup = dom.getPopup()

  if (!popup || dom.hasClass(popup, swalClasses.hide)) {
    return
  }

  const innerParams = privateProps.innerParams.get(this)
  const swalPromiseResolve = privateMethods.swalPromiseResolve.get(this)
  const { onClose } = innerParams

  replacePopupClass({ popup })

  handlePopupAnimation({ popup, innerParams })

  if (onClose !== null && typeof onClose === 'function') {
    onClose(popup)
  }

  // Resolve Swal promise
  swalPromiseResolve(resolveValue || {})

  // Unset this.params so GC will dispose it (#1569)
  delete this.params
}

const handlePopupAnimation = ({ popup, innerParams : { onAfterClose } }) => {
  const container = dom.getContainer()
  // If animation is supported, animate
  const animationIsSupported = dom.animationEndEvent && dom.hasCssAnimation(popup);

  if (animationIsSupported) {
    animatePopup({ popup, container, onAfterClose })
  } else {
    // Otherwise, remove immediately
    removePopupAndResetState(container, dom.isToast(), onAfterClose)
  }
}

const animatePopup = ({ popup, container, onAfterClose }) => {
  popup.addEventListener(dom.animationEndEvent, function (e) {
    if (e.target === popup) {
      swalCloseEventFinished(popup, container, dom.isToast(), onAfterClose)
    }
  })
}

const replacePopupClass = ({ popup }) => {
  dom.removeClass(popup, swalClasses.show)
  dom.addClass(popup, swalClasses.hide)
}

const unsetWeakMaps = (obj) => {
  for (const i in obj) {
    obj[i] = new WeakMap()
  }
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
