import { error } from '../utils/utils'
import defaultParams, {showWarningsForParams, isValidParameter} from '../utils/params'
import globalState from '../globalState'

/**
 * Set default params for each popup
 * @param {Object} userParams
 */
export const setDefaults = (userParams) => {
  if (!userParams || typeof userParams !== 'object') {
    return error('the argument for setDefaults() is required and has to be a object')
  }

  showWarningsForParams(userParams)

  // assign valid params from userParams to popupParams
  for (const param in userParams) {
    if (isValidParameter(param)) {
      globalState.popupParams[param] = userParams[param]
    }
  }
}

/**
 * Reset default params for each popup
 */
export const resetDefaults = () => {
  globalState.popupParams = Object.assign({}, defaultParams)
}
