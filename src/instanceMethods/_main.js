import defaultParams, { showWarningsForParams } from '../utils/params.js'
import * as dom from '../utils/dom/index.js'
import { swalClasses } from '../utils/classes.js'
import Timer from '../utils/Timer.js'
import { callIfFunction, isPromise } from '../utils/utils.js'
import setParameters from '../utils/setParameters.js'
import globalState from '../globalState.js'
import { openPopup } from '../utils/openPopup.js'
import privateProps from '../privateProps.js'
import privateMethods from '../privateMethods.js'
import { handleInputOptions, handleInputValue } from '../utils/dom/inputUtils.js'
import { handleConfirmButtonClick, handleCancelButtonClick } from './buttons-handlers.js'
import { addKeydownHandler, setFocus } from './keydown-handler.js'
import { handlePopupClick } from './popup-click-handler.js'
import { DismissReason } from '../utils/DismissReason.js'

export function _main (userParams) {
  showWarningsForParams(userParams)

  // Check if there is another Swal closing
  if (dom.getPopup() && globalState.swalCloseEventFinishedCallback) {
    globalState.swalCloseEventFinishedCallback()
    delete globalState.swalCloseEventFinishedCallback
  }

  // Check if there is a swal disposal defer timer
  if (globalState.deferDisposalTimer) {
    clearTimeout(globalState.deferDisposalTimer)
    delete globalState.deferDisposalTimer
  }

  const innerParams = Object.assign({}, defaultParams, userParams)
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

const swalPromise = (instance, domCache, innerParams) => {
  return new Promise((resolve) => { // eslint-disable-line complexity
    // functions to handle all closings/dismissals
    const dismissWith = (dismiss) => {
      instance.closePopup({ dismiss })
    }

    privateMethods.swalPromiseResolve.set(instance, resolve)

    // Close on timer
    if (innerParams.timer) {
      globalState.timeout = new Timer(() => {
        dismissWith('timer')
        delete globalState.timeout
      }, innerParams.timer)
    }

    // Click 'confirm' button
    domCache.confirmButton.onclick = () => {
      handleConfirmButtonClick(instance, innerParams)
    }

    // Click 'cancel' button
    domCache.cancelButton.onclick = () => {
      handleCancelButtonClick(instance, dismissWith)
    }

    // Closing popup by close button
    domCache.closeButton.onclick = () => {
      dismissWith(DismissReason.close)
    }

    handlePopupClick(domCache, innerParams, dismissWith)

    // Reverse buttons (Confirm on the right side)
    if (innerParams.reverseButtons) {
      domCache.confirmButton.parentNode.insertBefore(domCache.cancelButton, domCache.confirmButton)
    }

    addKeydownHandler(instance, globalState, innerParams, dismissWith)

    if (innerParams.toast && (innerParams.input || innerParams.footer || innerParams.showCloseButton)) {
      dom.addClass(document.body, swalClasses['toast-column'])
    } else {
      dom.removeClass(document.body, swalClasses['toast-column'])
    }

    // inputOptions, inputValue
    if (innerParams.input === 'select' || innerParams.input === 'radio') {
      handleInputOptions(instance, innerParams)
    } else if (['text', 'email', 'number', 'tel', 'textarea'].includes(innerParams.input) && isPromise(innerParams.inputValue)) {
      handleInputValue(instance, innerParams)
    }

    openPopup(innerParams)

    if (!innerParams.toast) {
      if (!callIfFunction(innerParams.allowEnterKey)) {
        if (document.activeElement && typeof document.activeElement.blur === 'function') {
          document.activeElement.blur()
        }
      } else if (innerParams.focusCancel && dom.isVisible(domCache.cancelButton)) {
        domCache.cancelButton.focus()
      } else if (innerParams.focusConfirm && dom.isVisible(domCache.confirmButton)) {
        domCache.confirmButton.focus()
      } else {
        setFocus(innerParams, -1, 1)
      }
    }

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
