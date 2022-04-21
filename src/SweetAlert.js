import defaultParams, { showWarningsForParams } from './utils/params.js'
import * as dom from './utils/dom/index.js'
import { callIfFunction } from './utils/utils.js'
import { DismissReason } from './utils/DismissReason.js'
import { unsetAriaHidden } from './utils/aria.js'
import { getTemplateParams } from './utils/getTemplateParams.js'
import setParameters from './utils/setParameters.js'
import Timer from './utils/Timer.js'
import { openPopup } from './utils/openPopup.js'
import { handleInputOptionsAndValue } from './utils/dom/inputUtils.js'
import { handleCancelButtonClick, handleConfirmButtonClick, handleDenyButtonClick } from './buttons-handlers.js'
import { handlePopupClick } from './popup-click-handler.js'
import { addKeydownHandler, setFocus } from './keydown-handler.js'
import * as staticMethods from './staticMethods.js'
import * as instanceMethods from './instanceMethods.js'
import privateProps from './privateProps.js'
import privateMethods from './privateMethods.js'
import globalState from './globalState.js'

let currentInstance

class SweetAlert {
  constructor(...args) {
    // Prevent run in Node env
    if (typeof window === 'undefined') {
      return
    }

    currentInstance = this

    // @ts-ignore
    const outerParams = Object.freeze(this.constructor.argsToParams(args))

    Object.defineProperties(this, {
      params: {
        value: outerParams,
        writable: false,
        enumerable: true,
        configurable: true,
      },
    })

    // @ts-ignore
    const promise = this._main(this.params)
    privateProps.promise.set(this, promise)
  }

  _main(userParams, mixinParams = {}) {
    showWarningsForParams(Object.assign({}, mixinParams, userParams))

    if (globalState.currentInstance) {
      globalState.currentInstance._destroy()
      if (dom.isModal()) {
        unsetAriaHidden()
      }
    }
    globalState.currentInstance = this

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

    const domCache = populateDomCache(this)

    dom.render(this, innerParams)

    privateProps.innerParams.set(this, innerParams)

    return swalPromise(this, domCache, innerParams)
  }

  // `catch` cannot be the name of a module export, so we define our thenable methods here instead
  then(onFulfilled) {
    const promise = privateProps.promise.get(this)
    return promise.then(onFulfilled)
  }

  finally(onFinally) {
    const promise = privateProps.promise.get(this)
    return promise.finally(onFinally)
  }
}

const swalPromise = (instance, domCache, innerParams) => {
  return new Promise((resolve, reject) => {
    // functions to handle all closings/dismissals
    const dismissWith = (dismiss) => {
      instance.closePopup({ isDismissed: true, dismiss })
    }

    privateMethods.swalPromiseResolve.set(instance, resolve)
    privateMethods.swalPromiseReject.set(instance, reject)

    domCache.confirmButton.onclick = () => handleConfirmButtonClick(instance)
    domCache.denyButton.onclick = () => handleDenyButtonClick(instance)
    domCache.cancelButton.onclick = () => handleCancelButtonClick(instance, dismissWith)

    domCache.closeButton.onclick = () => dismissWith(DismissReason.close)

    handlePopupClick(instance, domCache, dismissWith)

    addKeydownHandler(instance, globalState, innerParams, dismissWith)

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

const prepareParams = (userParams, mixinParams) => {
  const templateParams = getTemplateParams(userParams)
  const params = Object.assign({}, defaultParams, mixinParams, templateParams, userParams) // precedence is described in #2131
  params.showClass = Object.assign({}, defaultParams.showClass, params.showClass)
  params.hideClass = Object.assign({}, defaultParams.hideClass, params.hideClass)
  return params
}

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

const initFocus = (domCache, innerParams) => {
  if (innerParams.toast) {
    return
  }

  if (!callIfFunction(innerParams.allowEnterKey)) {
    return blurActiveElement()
  }

  if (!focusButton(domCache, innerParams)) {
    setFocus(innerParams, -1, 1)
  }
}

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
Object.assign(SweetAlert.prototype, instanceMethods)

// Assign static methods from src/staticMethods/*.js to constructor
Object.assign(SweetAlert, staticMethods)

// Proxy to instance methods to constructor, for now, for backwards compatibility
Object.keys(instanceMethods).forEach((key) => {
  SweetAlert[key] = function (...args) {
    if (currentInstance) {
      return currentInstance[key](...args)
    }
  }
})

SweetAlert.DismissReason = DismissReason

SweetAlert.version = '11.4.9'

export default SweetAlert
