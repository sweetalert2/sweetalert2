import * as dom from '../../src/utils/dom/index.js'
import { warn } from '../../src/utils/utils.js'
import { swalClasses } from '../../src/utils/classes.js'
import sweetAlert from '../sweetalert2.js'
import privateProps from '../privateProps.js'

/**
 * Updates popup parameters.
 */
export function update (params) {
  const popup = dom.getPopup()

  if (!popup || dom.hasClass(popup, swalClasses.hide)) {
    return warn(`You're trying to update the closed or closing popup, that won't work. Use the update() method in preConfirm parameter or show a new popup.`)
  }

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
