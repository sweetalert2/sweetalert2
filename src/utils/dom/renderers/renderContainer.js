import { swalClasses } from '../../classes.js'
import { objectValues, warn, toArray } from '../../utils.js'
import * as dom from '../../dom/index.js'

export const renderContainer = (params) => {
  const container = dom.getContainer()

  if (!container) {
    return
  }

  // Backdrop
  if (typeof params.backdrop === 'string') {
    container.style.background = params.backdrop
  } else if (!params.backdrop) {
    dom.addClass([document.documentElement, document.body], swalClasses['no-backdrop'])
  }
  if (!params.backdrop && params.allowOutsideClick) {
    warn('"allowOutsideClick" parameter requires `backdrop` parameter to be set to `true`')
  }

  // Position
  if (params.position in swalClasses) {
    dom.addClass(container, swalClasses[params.position])
  } else {
    warn('The "position" parameter is not valid, defaulting to "center"')
    dom.addClass(container, swalClasses.center)
  }

  // Grow
  if (params.grow && typeof params.grow === 'string') {
    let growClass = 'grow-' + params.grow
    if (growClass in swalClasses) {
      dom.addClass(container, swalClasses[growClass])
    }
  }

  // Clean up previous custom classes
  toArray(container.classList).forEach(className => {
    if (!objectValues(swalClasses).includes(className)) {
      container.classList.remove(className)
    }
  })

  // Custom class
  if (params.customClass) {
    dom.addClass(container, params.customClass.container)
  }
  if (params.customContainerClass) { // @deprecated
    dom.addClass(container, params.customContainerClass)
  }
}
