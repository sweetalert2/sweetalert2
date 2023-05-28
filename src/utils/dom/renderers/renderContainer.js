import { swalClasses } from '../../classes.js'
import * as dom from '../../dom/index.js'
import { warn } from '../../utils.js'

/**
 * @param {SweetAlert} instance
 * @param {SweetAlertOptions} params
 */
export const renderContainer = (instance, params) => {
  const container = dom.getContainer()

  if (!container) {
    return
  }

  handleBackdropParam(container, params.backdrop)

  handlePositionParam(container, params.position)
  handleGrowParam(container, params.grow)

  // Custom class
  dom.applyCustomClass(container, params, 'container')
}

/**
 * @param {HTMLElement} container
 * @param {SweetAlertOptions['backdrop']} backdrop
 */
function handleBackdropParam(container, backdrop) {
  if (typeof backdrop === 'string') {
    container.style.background = backdrop
  } else if (!backdrop) {
    dom.addClass([document.documentElement, document.body], swalClasses['no-backdrop'])
  }
}

/**
 * @param {HTMLElement} container
 * @param {SweetAlertOptions['position']} position
 */
function handlePositionParam(container, position) {
  if (position in swalClasses) {
    dom.addClass(container, swalClasses[position])
  } else {
    warn('The "position" parameter is not valid, defaulting to "center"')
    dom.addClass(container, swalClasses.center)
  }
}

/**
 * @param {HTMLElement} container
 * @param {SweetAlertOptions['grow']} grow
 */
function handleGrowParam(container, grow) {
  if (grow && typeof grow === 'string') {
    const growClass = `grow-${grow}`
    if (growClass in swalClasses) {
      dom.addClass(container, swalClasses[growClass])
    }
  }
}
