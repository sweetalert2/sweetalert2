import globalState from '../globalState.js'
import privateProps from '../privateProps.js'
import privateMethods from '../privateMethods.js'

export function _destroy () {
  const innerParams = privateProps.innerParams.get(this)
  if (!innerParams) {
    return
  }
  if (typeof innerParams.onDestroy === 'function') {
    innerParams.onDestroy()
  }
  disposeSwal(this)
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
