import {showWarningsForParams} from '../utils/params'

let defaults = {}

export function withGlobalDefaults (ParentSwal) {
  class SwalWithGlobalDefaults extends ParentSwal {
    _main (params) {
      return super._main(Object.assign({}, defaults, params))
    }

    static setDefaults (params) {
      if (!params || typeof params !== 'object') {
        throw new TypeError('SweetAlert2: The argument for setDefaults() is required and has to be a object')
      }
      showWarningsForParams(params)
      // assign valid params from `params` to `defaults`
      Object.keys(params).forEach(param => {
        if (ParentSwal.isValidParameter(param)) {
          defaults[param] = params[param]
        }
      })
    }

    static resetDefaults () {
      defaults = {}
    }
  }

  // Set default params if `window._swalDefaults` is an object
  if (typeof window !== 'undefined' && typeof window._swalDefaults === 'object') {
    SwalWithGlobalDefaults.setDefaults(window._swalDefaults)
  }

  return SwalWithGlobalDefaults
}
