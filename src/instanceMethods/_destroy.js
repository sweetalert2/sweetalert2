import globalState from '../globalState.js'
import privateProps from '../privateProps.js'
import privateMethods from '../privateMethods.js'

export function _destroy () {
  const domCache = privateProps.domCache.get(this)
  const innerParams = privateProps.innerParams.get(this)

  if (!innerParams) {
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

  runDidDestroy(innerParams)

  disposeSwal(this)
}

const runDidDestroy = (innerParams) => {
  if (typeof innerParams.didDestroy === 'function') {
    innerParams.didDestroy()
  } else if (typeof innerParams.onDestroy === 'function') {
    innerParams.onDestroy() // @deprecated
  }
}

const disposeSwal = (instance) => {
  // Unset this.params so GC will dispose it (#1569)
  delete instance.params
  // Unset globalState props so GC will dispose globalState (#1569)
  delete globalState.keydownHandler
  delete globalState.keydownTarget
  // Unset WeakMaps so GC will be able to dispose them (#1569)
  unsetWeakMaps(privateProps)
  unsetWeakMaps(privateMethods)
}

const unsetWeakMaps = (obj) => {
  for (const i in obj) {
    obj[i] = new WeakMap()
  }
}
