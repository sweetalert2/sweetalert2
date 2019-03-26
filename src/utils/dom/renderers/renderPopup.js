import { swalClasses } from '../../classes.js'
import * as dom from '../../dom/index.js'

export const renderPopup = (params) => {
  const popup = dom.getPopup();

  // Width and Padding
  ['width', 'padding'].forEach(param => {
    const paramValue = params[param]
    if (paramValue !== null) {
      popup.style[param] = (typeof paramValue === 'number') ? paramValue + 'px' : paramValue
    }
  })

  // Background
  if (params.background) {
    popup.style.background = params.background
  }

  // Default Class
  popup.className = swalClasses.popup
  if (params.toast) {
    dom.addClass([document.documentElement, document.body], swalClasses['toast-shown'])
    dom.addClass(popup, swalClasses.toast)
  } else {
    dom.addClass(popup, swalClasses.modal)
  }

  // Custom class
  dom.applyCustomClass(popup, params.customClass, 'popup')
  if (typeof params.customClass === 'string') {
    dom.addClass(popup, params.customClass)
  }

  // CSS animation
  if (params.animation) {
    dom.removeClass(popup, swalClasses.noanimation)
  } else {
    dom.addClass(popup, swalClasses.noanimation)
  }
}
