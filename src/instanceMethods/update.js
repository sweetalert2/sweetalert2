import * as dom from '../../src/utils/dom/index.js'
import { warn } from '../../src/utils/utils.js'
import sweetAlert from '../sweetalert2.js'
import privateProps from '../privateProps.js'

/**
 * Updates popup options.
 */
export function update (params) {
  const validUpdatableParams = {}

  // assign valid params from `params` to `defaults`
  Object.keys(params).forEach(param => {
    if (sweetAlert.isUpdatableParameter(param)) {
      validUpdatableParams[param] = params[param]
    } else {
      warn(`Invalid parameter to update: "${param}". Updatable params are listed here: TODO (@limonte) add link`)
    }
  })

  const innerParams = privateProps.innerParams.get(this)
  const updatedParams = Object.assign({}, innerParams, validUpdatableParams)

  // Actions
  dom.renderActions(updatedParams)

  // Content
  dom.renderContent(updatedParams)

  // Icon
  dom.renderIcon(updatedParams)

  // Image
  dom.renderImage(updatedParams)

  // Progress steps
  dom.renderProgressSteps(updatedParams)

  // Title
  dom.renderTitle(updatedParams)


  privateProps.innerParams.set(this, updatedParams)
}
