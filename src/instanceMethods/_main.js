import defaultParams, { showWarningsForParams } from '../utils/params.js'
import * as dom from '../utils/dom/index.js'
import { swalClasses } from '../utils/classes.js'
import Timer from '../utils/Timer.js'
import { callIfFunction } from '../utils/utils.js'
import setParameters from '../utils/setParameters.js'
import globalState from '../globalState.js'
import { openPopup } from '../utils/openPopup.js'
import privateProps from '../privateProps.js'
import privateMethods from '../privateMethods.js'
import { handleInputOptionsAndValue } from '../utils/dom/inputUtils.js'
import { handleConfirmButtonClick, handleCancelButtonClick } from './buttons-handlers.js'
import { addKeydownHandler, setFocus } from './keydown-handler.js'
import { handlePopupClick } from './popup-click-handler.js'
import { DismissReason } from '../utils/DismissReason.js'

export function _main (userParams) {
  showWarningsForParams(userParams)

  if (globalState.currentInstance) {
    globalState.currentInstance._destroy()
  }
  globalState.currentInstance = this

  const innerParams = prepareParams(userParams)
  setParameters(innerParams)
  Object.freeze(innerParams)

  // clear the previous timer
  if (globalState.timeout) {
    globalState.timeout.stop()
    delete globalState.timeout
  }

  // clear the restore focus timeout
  clearTimeout(globalState.restoreFocusTimeout)

  const domCache = populateDomCache(this)

  dom.render(this, innerParams)

  privateProps.innerParams.set(this, innerParams)

  return swalPromise(this, domCache, innerParams)
}

const prepareParams = (userParams) => {
  const showClass = Object.assign({}, defaultParams.showClass, userParams.showClass)
  const hideClass = Object.assign({}, defaultParams.hideClass, userParams.hideClass)
  const params = Object.assign({}, defaultParams, userParams)
  params.showClass = showClass
  params.hideClass = hideClass
  // @deprecated
  if (userParams.animation === false) {
    params.showClass = {
      popup: '',
      backdrop: 'swal2-backdrop-show swal2-noanimation'
    }
    params.hideClass = {}
  }
  return params
}

const swalPromise = (instance, domCache, innerParams) => {
  return new Promise((resolve) => {
    // functions to handle all closings/dismissals
    const dismissWith = (dismiss) => {
      instance.closePopup({ dismiss })
    }

    privateMethods.swalPromiseResolve.set(instance, resolve)

    setupTimer(globalState, innerParams, dismissWith)

    domCache.confirmButton.onclick = () => handleConfirmButtonClick(instance, innerParams)
    domCache.cancelButton.onclick = () => handleCancelButtonClick(instance, dismissWith)

    domCache.closeButton.onclick = () => dismissWith(DismissReason.close)

    handlePopupClick(instance, domCache, dismissWith)

    addKeydownHandler(instance, globalState, innerParams, dismissWith)

    if (innerParams.toast && (innerParams.input || innerParams.footer || innerParams.showCloseButton)) {
      dom.addClass(document.body, swalClasses['toast-column'])
    } else {
      dom.removeClass(document.body, swalClasses['toast-column'])
    }

    handleInputOptionsAndValue(instance, innerParams)

    openPopup(innerParams)

    initFocus(domCache, innerParams)

    // Scroll container to top on open (#1247)
    domCache.container.scrollTop = 0
  })
}

const populateDomCache = (instance) => {
  const domCache = {
    popup: dom.getPopup(),
    container: dom.getContainer(),
    content: dom.getContent(),
    actions: dom.getActions(),
    confirmButton: dom.getConfirmButton(),
    cancelButton: dom.getCancelButton(),
    closeButton: dom.getCloseButton(),
    validationMessage: dom.getValidationMessage(),
    progressSteps: dom.getProgressSteps()
  }
  privateProps.domCache.set(instance, domCache)

  return domCache
}

const setupTimer = (globalState, innerParams, dismissWith) => {
  const timerProgressBar = dom.getTimerProgressBar()
  dom.hide(timerProgressBar)
  if (innerParams.timer) {
    globalState.timeout = new Timer(() => {
      dismissWith('timer')
      delete globalState.timeout
    }, innerParams.timer)
    if (innerParams.timerProgressBar) {
      dom.show(timerProgressBar)
      setTimeout(() => {
        if (globalState.timeout.running) { // timer can be already stopped at this point
          dom.animateTimerProgressBar(innerParams.timer)
        }
      })
    }
  }
}

const initFocus = (domCache, innerParams) => {
  if (innerParams.toast) {
    return
  }

  if (!callIfFunction(innerParams.allowEnterKey)) {
    return blurActiveElement()
  }

  if (innerParams.focusCancel && dom.isVisible(domCache.cancelButton)) {
    return domCache.cancelButton.focus()
  }

  if (innerParams.focusConfirm && dom.isVisible(domCache.confirmButton)) {
    return domCache.confirmButton.focus()
  }

  setFocus(innerParams, -1, 1)
}

const blurActiveElement = () => {
  if (document.activeElement && typeof document.activeElement.blur === 'function') {
    document.activeElement.blur()
  }
}
