// Currently, `this` is the private `context` (or `currentContext`) object

import * as dom from '../utils/dom/index'
import { swalClasses } from '../utils/classes'

/**
 * Show spinner instead of Confirm button and disable Cancel button
 */
function hideLoading () {
  const {params, domCache} = this
  if (!params.showConfirmButton) {
    dom.hide(domCache.confirmButton)
    if (!params.showCancelButton) {
      dom.hide(domCache.actions)
    }
  }
  dom.removeClass([domCache.popup, domCache.actions], swalClasses.loading)
  domCache.popup.removeAttribute('aria-busy')
  domCache.popup.removeAttribute('data-loading')
  domCache.confirmButton.disabled = false
  domCache.cancelButton.disabled = false
}

export {
  hideLoading,
  hideLoading as disableLoading
}
