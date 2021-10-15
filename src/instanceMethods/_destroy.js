import globalState from '../globalState.js'
import privateProps from '../privateProps.js'
import privateMethods from '../privateMethods.js'

export function _destroy () {
  const domCache = privateProps.domCache.get(this)
  const innerParams = privateProps.innerParams.get(this)

  if (!innerParams) {
    disposeSwal(this)
    return // This instance has already been destroyed
  }

  // Check if there is another Swal closing
  if (domCache.popup && globalState.swalCloseEventFinishedCallback) {
    globalState.swalCloseEventFinishedCallback()
    delete globalState.swalCloseEventFinishedCallback
  }

  // Check if there is a swal disposal defer timer
  if (globalState.deferDisposalTimer) {
    clearTimeout(globalState.deferDisposalTimer)
    delete globalState.deferDisposalTimer
  }

  if (typeof innerParams.didDestroy === 'function') {
    innerParams.didDestroy()
  }

  disposeSwal(this)
}

const disposeSwal = (instance) => {
  // Unset this.params so GC will dispose it (#1569)
  delete instance.params
  // Unset globalState props so GC will dispose globalState (#1569)
  delete globalState.keydownHandler
  delete globalState.keydownTarget
  // If the current instance is awaiting a promise result, we keep the privateMethods to call them once the promise result is retreived
  if (!privateProps.awaitingPromise.get(instance)) {
    unsetWeakMaps(privateMethods, instance)
  }
  // Unset WeakMaps so GC will be able to dispose them (#1569)
  unsetWeakMaps(privateProps, instance)
  // Unset currentInstance
  delete globalState.currentInstance
}

const unsetWeakMaps = (obj, instance) => {
  for (const i in obj) {
    obj[i].delete(instance)
  }
}
