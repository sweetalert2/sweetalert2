import { handleCancelButtonClick, handleConfirmButtonClick, handleDenyButtonClick } from './buttons-handlers.js'
import globalState from './globalState.js'
import * as instanceMethods from './instanceMethods.js'
import { addKeydownHandler, setFocus } from './keydown-handler.js'
import { handlePopupClick } from './popup-click-handler.js'
import privateMethods from './privateMethods.js'
import privateProps from './privateProps.js'
import * as staticMethods from './staticMethods.js'
import { DismissReason } from './utils/DismissReason.js'
import Timer from './utils/Timer.js'
import { unsetAriaHidden } from './utils/aria.js'
import * as dom from './utils/dom/index.js'
import { handleInputOptionsAndValue } from './utils/dom/inputUtils.js'
import { getTemplateParams } from './utils/getTemplateParams.js'
import { openPopup } from './utils/openPopup.js'
import defaultParams, { showWarningsForParams } from './utils/params.js'
import setParameters from './utils/setParameters.js'
import { callIfFunction, warnAboutDeprecation } from './utils/utils.js'

/** @type {SweetAlert} */
let currentInstance

export class SweetAlert {
  /**
   * @type {Promise<SweetAlertResult>}
   */
  #promise

  /**
   * @param {...any} args
   * @this {SweetAlert}
   */
  constructor(...args) {
    // Prevent run in Node env
    if (typeof window === 'undefined') {
      return
    }

    currentInstance = this

    // @ts-ignore
    const outerParams = Object.freeze(this.constructor.argsToParams(args))

    /** @type {Readonly<SweetAlertOptions>} */
    this.params = outerParams

    /** @type {boolean} */
    this.isAwaitingPromise = false

    this.#promise = this._main(currentInstance.params)
  }

  _main(userParams, mixinParams = {}) {
    showWarningsForParams(Object.assign({}, mixinParams, userParams))

    if (globalState.currentInstance) {
      const swalPromiseResolve = privateMethods.swalPromiseResolve.get(globalState.currentInstance)
      const { isAwaitingPromise } = globalState.currentInstance
      globalState.currentInstance._destroy()
      if (!isAwaitingPromise) {
        swalPromiseResolve({ isDismissed: true })
      }
      if (dom.isModal()) {
        unsetAriaHidden()
      }
    }

    globalState.currentInstance = currentInstance

    const innerParams = prepareParams(userParams, mixinParams)
    setParameters(innerParams)
    Object.freeze(innerParams)

    // clear the previous timer
    if (globalState.timeout) {
      globalState.timeout.stop()
      delete globalState.timeout
    }

    // clear the restore focus timeout
    clearTimeout(globalState.restoreFocusTimeout)

    const domCache = populateDomCache(currentInstance)

    dom.render(currentInstance, innerParams)

    privateProps.innerParams.set(currentInstance, innerParams)

    return swalPromise(currentInstance, domCache, innerParams)
  }

  // `catch` cannot be the name of a module export, so we define our thenable methods here instead
  then(onFulfilled) {
    return this.#promise.then(onFulfilled)
  }

  finally(onFinally) {
    return this.#promise.finally(onFinally)
  }
}

/**
 * @param {SweetAlert} instance
 * @param {DomCache} domCache
 * @param {SweetAlertOptions} innerParams
 * @returns {Promise}
 */
const swalPromise = (instance, domCache, innerParams) => {
  return new Promise((resolve, reject) => {
    // functions to handle all closings/dismissals
    /**
     * @param {DismissReason} dismiss
     */
    const dismissWith = (dismiss) => {
      instance.close({ isDismissed: true, dismiss })
    }

    privateMethods.swalPromiseResolve.set(instance, resolve)
    privateMethods.swalPromiseReject.set(instance, reject)

    domCache.confirmButton.onclick = () => {
      handleConfirmButtonClick(instance)
    }

    domCache.denyButton.onclick = () => {
      handleDenyButtonClick(instance)
    }

    domCache.cancelButton.onclick = () => {
      handleCancelButtonClick(instance, dismissWith)
    }

    domCache.closeButton.onclick = () => {
      dismissWith(DismissReason.close)
    }

    handlePopupClick(innerParams, domCache, dismissWith)

    addKeydownHandler(globalState, innerParams, dismissWith)

    handleInputOptionsAndValue(instance, innerParams)

    openPopup(innerParams)

    setupTimer(globalState, innerParams, dismissWith)

    initFocus(domCache, innerParams)

    // Scroll container to top on open (#1247, #1946)
    setTimeout(() => {
      domCache.container.scrollTop = 0
    })
  })
}

/**
 * @param {SweetAlertOptions} userParams
 * @param {SweetAlertOptions} mixinParams
 * @returns {SweetAlertOptions}
 */
const prepareParams = (userParams, mixinParams) => {
  const templateParams = getTemplateParams(userParams)
  const params = Object.assign({}, defaultParams, mixinParams, templateParams, userParams) // precedence is described in #2131
  params.showClass = Object.assign({}, defaultParams.showClass, params.showClass)
  params.hideClass = Object.assign({}, defaultParams.hideClass, params.hideClass)
  if (params.animation === false) {
    params.showClass = {
      backdrop: 'swal2-noanimation',
    }
    params.hideClass = {}
  }
  return params
}

/**
 * @param {SweetAlert} instance
 * @returns {DomCache}
 */
const populateDomCache = (instance) => {
  const domCache = {
    popup: dom.getPopup(),
    container: dom.getContainer(),
    actions: dom.getActions(),
    confirmButton: dom.getConfirmButton(),
    denyButton: dom.getDenyButton(),
    cancelButton: dom.getCancelButton(),
    loader: dom.getLoader(),
    closeButton: dom.getCloseButton(),
    validationMessage: dom.getValidationMessage(),
    progressSteps: dom.getProgressSteps(),
  }
  privateProps.domCache.set(instance, domCache)

  return domCache
}

/**
 * @param {GlobalState} globalState
 * @param {SweetAlertOptions} innerParams
 * @param {Function} dismissWith
 */
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
      dom.applyCustomClass(timerProgressBar, innerParams, 'timerProgressBar')
      setTimeout(() => {
        if (globalState.timeout && globalState.timeout.running) {
          // timer can be already stopped or unset at this point
          dom.animateTimerProgressBar(innerParams.timer)
        }
      })
    }
  }
}

/**
 * Initialize focus in the popup:
 *
 * 1. If `toast` is `true`, don't steal focus from the document.
 * 2. Else if there is an [autofocus] element, focus it.
 * 3. Else if `focusConfirm` is `true` and confirm button is visible, focus it.
 * 4. Else if `focusDeny` is `true` and deny button is visible, focus it.
 * 5. Else if `focusCancel` is `true` and cancel button is visible, focus it.
 * 6. Else focus the first focusable element in a popup (if any).
 *
 * @param {DomCache} domCache
 * @param {SweetAlertOptions} innerParams
 */
const initFocus = (domCache, innerParams) => {
  if (innerParams.toast) {
    return
  }
  // TODO: this is dumb, remove `allowEnterKey` param in the next major version
  if (!callIfFunction(innerParams.allowEnterKey)) {
    warnAboutDeprecation('allowEnterKey')
    blurActiveElement()
    return
  }

  if (focusAutofocus(domCache)) {
    return
  }

  if (focusButton(domCache, innerParams)) {
    return
  }

  setFocus(-1, 1)
}

/**
 * @param {DomCache} domCache
 * @returns {boolean}
 */
const focusAutofocus = (domCache) => {
  const autofocusElements = Array.from(domCache.popup.querySelectorAll('[autofocus]'))
  for (const autofocusElement of autofocusElements) {
    if (autofocusElement instanceof HTMLElement && dom.isVisible(autofocusElement)) {
      autofocusElement.focus()
      return true
    }
  }
  return false
}

/**
 * @param {DomCache} domCache
 * @param {SweetAlertOptions} innerParams
 * @returns {boolean}
 */
const focusButton = (domCache, innerParams) => {
  if (innerParams.focusDeny && dom.isVisible(domCache.denyButton)) {
    domCache.denyButton.focus()
    return true
  }

  if (innerParams.focusCancel && dom.isVisible(domCache.cancelButton)) {
    domCache.cancelButton.focus()
    return true
  }

  if (innerParams.focusConfirm && dom.isVisible(domCache.confirmButton)) {
    domCache.confirmButton.focus()
    return true
  }

  return false
}

const blurActiveElement = () => {
  if (document.activeElement instanceof HTMLElement && typeof document.activeElement.blur === 'function') {
    document.activeElement.blur()
  }
}

// Assign instance methods from src/instanceMethods/*.js to prototype
SweetAlert.prototype.disableButtons = instanceMethods.disableButtons
SweetAlert.prototype.enableButtons = instanceMethods.enableButtons
SweetAlert.prototype.getInput = instanceMethods.getInput
SweetAlert.prototype.disableInput = instanceMethods.disableInput
SweetAlert.prototype.enableInput = instanceMethods.enableInput
SweetAlert.prototype.hideLoading = instanceMethods.hideLoading
SweetAlert.prototype.disableLoading = instanceMethods.disableLoading
SweetAlert.prototype.showValidationMessage = instanceMethods.showValidationMessage
SweetAlert.prototype.resetValidationMessage = instanceMethods.resetValidationMessage
SweetAlert.prototype.close = instanceMethods.close
SweetAlert.prototype.closePopup = instanceMethods.closePopup
SweetAlert.prototype.closeModal = instanceMethods.closeModal
SweetAlert.prototype.closeToast = instanceMethods.closeToast
SweetAlert.prototype.rejectPromise = instanceMethods.rejectPromise
SweetAlert.prototype.update = instanceMethods.update
SweetAlert.prototype._destroy = instanceMethods._destroy

// Assign static methods from src/staticMethods/*.js to constructor
Object.assign(SweetAlert, staticMethods)

// Proxy to instance methods to constructor, for now, for backwards compatibility
Object.keys(instanceMethods).forEach((key) => {
  /**
   * @param {...any} args
   * @returns {any | undefined}
   */
  SweetAlert[key] = function (...args) {
    if (currentInstance && currentInstance[key]) {
      return currentInstance[key](...args)
    }
    return null
  }
})

SweetAlert.DismissReason = DismissReason

SweetAlert.version = '11.23.0'

export default SweetAlert
