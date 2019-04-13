import * as dom from '../../src/utils/dom/index.js'
import { warn } from '../../src/utils/utils.js'
import sweetAlert from '../sweetalert2.js'
import privateProps from '../privateProps.js'

/**
 * Updates popup parameters.
 */
export function update (params) {
  const validUpdatableParams = {}

  // assign valid params from `params` to `defaults`
  Object.keys(params).forEach(param => {
    if (sweetAlert.isUpdatableParameter(param)) {
      validUpdatableParams[param] = params[param]
    } else {
      warn(`Invalid parameter to update: "${param}". Updatable params are listed here: https://github.com/sweetalert2/sweetalert2/blob/master/src/utils/params.js`)
    }
  })

  const innerParams = privateProps.innerParams.get(this)
  const updatedParams = Object.assign({}, innerParams, validUpdatableParams)

  dom.render(this, updatedParams)

  privateProps.innerParams.set(this, updatedParams)
  Object.defineProperties(this, {
    params: {
      value: Object.assign({}, this.params, params),
      writable: false,
      enumerable: true
    }
  })
}
