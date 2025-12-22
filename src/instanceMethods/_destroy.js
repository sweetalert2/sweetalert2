import globalState from '../globalState.js'
import privateMethods from '../privateMethods.js'
import privateProps from '../privateProps.js'

/**
 * Dispose the current SweetAlert2 instance
 * @this {SweetAlert}
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
  globalState.eventEmitter?.emit('didDestroy')
  disposeSwal(this)
}

/**
 * @param {SweetAlert} instance
 */
const disposeSwal = (instance) => {
  disposeWeakMaps(instance)
  // Unset this.params so GC will dispose it (#1569)
  // @ts-ignore
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

    // @ts-ignore
    delete instance.isAwaitingPromise
    // Unset instance methods
    // @ts-ignore
    delete instance.disableButtons
    // @ts-ignore
    delete instance.enableButtons
    // @ts-ignore
    delete instance.getInput
    // @ts-ignore
    delete instance.disableInput
    // @ts-ignore
    delete instance.enableInput
    // @ts-ignore
    delete instance.hideLoading
    // @ts-ignore
    delete instance.disableLoading
    // @ts-ignore
    delete instance.showValidationMessage
    // @ts-ignore
    delete instance.resetValidationMessage
    // @ts-ignore
    delete instance.close
    // @ts-ignore
    delete instance.closePopup
    // @ts-ignore
    delete instance.closeModal
    // @ts-ignore
    delete instance.closeToast
    // @ts-ignore
    delete instance.rejectPromise
    // @ts-ignore
    delete instance.update
    // @ts-ignore
    delete instance._destroy
  }
}

/**
 * @param {Record<string, WeakMap<any, any>>} obj
 * @param {SweetAlert} instance
 */
const unsetWeakMaps = (obj, instance) => {
  for (const i in obj) {
    obj[i].delete(instance)
  }
}
