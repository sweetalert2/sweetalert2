import { error } from './utils/utils.js'
import { DismissReason } from './utils/DismissReason'
import {version} from '../package.json'
import * as staticMethods from './staticMethods'
import * as instanceMethods from './instanceMethods'

let currentInstance

// SweetAlert constructor
function SweetAlert (...args) {
  // Prevent run in Node env
  if (typeof window === 'undefined') {
    return
  }

  // Check for the existence of Promise
  if (typeof Promise === 'undefined') {
    error('This package requires a Promise library, please include a shim to enable it in this browser (See: https://github.com/sweetalert2/sweetalert2/wiki/Migration-from-SweetAlert-to-SweetAlert2#1-ie-support)')
  }

  if (typeof args[0] === 'undefined') {
    error('SweetAlert2 expects at least 1 attribute!')
    return false
  }

  // handle things when constructor is invoked without the `new` keyword
  if (!(this instanceof SweetAlert)) {
    return new SweetAlert(...args)
  }

  currentInstance = this

  this._promise = this._main(this.constructor.argsToParams(args))
}

// `catch` cannot be the name of a module export, so we define our thenable methods here instead
SweetAlert.prototype.then = function (onFulfilled, onRejected) {
  return this._promise.then(onFulfilled, onRejected)
}
SweetAlert.prototype.catch = function (onRejected) {
  return this._promise.catch(onRejected)
}
SweetAlert.prototype.finally = function (onFinally) {
  return this._promise.finally(onFinally)
}

// Assign instance methods from src/instanceMethods/*.js to prototype
Object.assign(SweetAlert.prototype, instanceMethods)

// Assign static methods from src/staticMethods/*.js to constructor
Object.assign(SweetAlert, staticMethods)

// Proxy to instance methods to constructor, for now, for backwards compatibility
Object.keys(instanceMethods).forEach(key => {
  SweetAlert[key] = function (...args) {
    if (currentInstance) {
      return currentInstance[key](...args)
    }
  }
})

SweetAlert.DismissReason = DismissReason

SweetAlert.noop = () => { }

SweetAlert.version = version

SweetAlert.default = SweetAlert

/**
 * Set default params if `window._swalDefaults` is an object
 */
if (typeof window !== 'undefined' && typeof window._swalDefaults === 'object') {
  SweetAlert.setDefaults(window._swalDefaults)
}

export default SweetAlert
