import { warn, callIfFunction } from './utils.js'
import * as dom from './dom/index.js'
import defaultInputValidators from './defaultInputValidators.js'

/**
 * Set type, text and actions on popup
 *
 * @param params
 * @returns {boolean}
 */
export default function setParameters (params) {
  // Use default `inputValidator` for supported input types if not provided
  if (!params.inputValidator) {
    Object.keys(defaultInputValidators).forEach((key) => {
      if (params.input === key) {
        params.inputValidator = defaultInputValidators[key]
      }
    })
  }

  // showLoaderOnConfirm && preConfirm
  if (params.showLoaderOnConfirm && !params.preConfirm) {
    warn(
      'showLoaderOnConfirm is set to true, but preConfirm is not defined.\n' +
      'showLoaderOnConfirm should be used together with preConfirm, see usage example:\n' +
      'https://sweetalert2.github.io/#ajax-request'
    )
  }

  // params.animation will be actually used in renderPopup.js
  // but in case when params.animation is a function, we need to call that function
  // before popup (re)initialization, so it'll be possible to check Swal.isVisible()
  // inside the params.animation function
  params.animation = callIfFunction(params.animation)

  // Determine if the custom target element is valid
  if (
    !params.target ||
    (typeof params.target === 'string' && !document.querySelector(params.target)) ||
    (typeof params.target !== 'string' && !params.target.appendChild)
  ) {
    warn('Target parameter is not valid, defaulting to "body"')
    params.target = 'body'
  }

  // Replace newlines with <br> in title
  if (typeof params.title === 'string') {
    params.title = params.title.split('\n').join('<br />');
  }

  const oldPopup = dom.getPopup()
  let targetElement = typeof params.target === 'string' ? document.querySelector(params.target) : params.target
  if (
    !oldPopup ||
    // If the model target has changed, refresh the popup
    (oldPopup && targetElement && oldPopup.parentNode !== targetElement.parentNode)
  ) {
    dom.init(params)
  }
}

