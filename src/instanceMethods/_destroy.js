import globalState from '../globalState.js'
import privateMethods from '../privateMethods.js'
import privateProps from '../privateProps.js'

/**
 * Dispose the current SweetAlert2 instance
 */
export function _destroy() {
  const domCache = privateProps.domCache.get(this)
  const innerParams = privateProps.innerParams.get(this)

  if (!innerParams) {
    disposeWeakMaps(this) // The WeakMaps might have been partly destroyed, we must recall it to dispose any remaining WeakMaps #2335
    return // This instance has already been destroyed
  }

  // Check if there is another Swal closing
  if (domCache.popup && globalState.swalCloseEventFinishedCallback) {
    globalState.swalCloseEventFinishedCallback()
    delete globalState.swalCloseEventFinishedCallback
  }

  if (typeof innerParams.didDestroy === 'function') {
    innerParams.didDestroy()
  }
  disposeSwal(this)
}

/**
 * @param {SweetAlert} instance
 */
const disposeSwal = (instance) => {
  disposeWeakMaps(instance)
  // Unset this.params so GC will dispose it (#1569)
  delete instance.params
  // Unset globalState props so GC will dispose globalState (#1569)
  delete globalState.keydownHandler
  delete globalState.keydownTarget
  // Unset currentInstance
  delete globalState.currentInstance
}

/**
 * @param {SweetAlert} instance
 */
const disposeWeakMaps = (instance) => {
  // If the current instance is awaiting a promise result, we keep the privateMethods to call them once the promise result is retrieved #2335
  if (instance.isAwaitingPromise) {
    unsetWeakMaps(privateProps, instance)
    instance.isAwaitingPromise = true
  } else {
    unsetWeakMaps(privateMethods, instance)
    unsetWeakMaps(privateProps, instance)

    delete instance.isAwaitingPromise
    // Unset instance methods
    delete instance.disableButtons
    delete instance.enableButtons
    delete instance.getInput
    delete instance.disableInput
    delete instance.enableInput
    delete instance.hideLoading
    delete instance.disableLoading
    delete instance.showValidationMessage
    delete instance.resetValidationMessage
    delete instance.close
    delete instance.closePopup
    delete instance.closeModal
    delete instance.closeToast
    delete instance.rejectPromise
    delete instance.update
    delete instance._destroy
  }
}

/**
 * @param {object} obj
 * @param {SweetAlert} instance
 */
const unsetWeakMaps = (obj, instance) => {
  for (const i in obj) {
    obj[i].delete(instance)
  }
}
