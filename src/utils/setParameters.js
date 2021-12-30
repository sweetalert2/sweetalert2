import { warn } from './utils.js'
import * as dom from './dom/index.js'
import defaultInputValidators from './defaultInputValidators.js'

function setDefaultInputValidators (params) {
  // Use default `inputValidator` for supported input types if not provided
  if (!params.inputValidator) {
    Object.keys(defaultInputValidators).forEach((key) => {
      if (params.input === key) {
        params.inputValidator = defaultInputValidators[key]
      }
    })
  }
}

function validateCustomTargetElement (params) {
  // Determine if the custom target element is valid
  if (
    !params.target ||
    (typeof params.target === 'string' && !document.querySelector(params.target)) ||
    (typeof params.target !== 'string' && !params.target.appendChild)
  ) {
    warn('Target parameter is not valid, defaulting to "body"')
    params.target = 'body'
  }
}

/**
 * Set type, text and actions on popup
 *
 * @param params
 */
export default function setParameters (params) {
  setDefaultInputValidators(params)

  // showLoaderOnConfirm && preConfirm
  if (params.showLoaderOnConfirm && !params.preConfirm) {
    warn(
      'showLoaderOnConfirm is set to true, but preConfirm is not defined.\n' +
      'showLoaderOnConfirm should be used together with preConfirm, see usage example:\n' +
      'https://sweetalert2.github.io/#ajax-request'
    )
  }

  validateCustomTargetElement(params)

  // Replace newlines with <br> in title
  if (typeof params.title === 'string') {
    params.title = params.title.split('\n').join('<br />')
  }

  dom.init(params)
}
