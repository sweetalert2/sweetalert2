import * as dom from '../utils/dom/index'
import { swalClasses } from '../utils/classes'

/**
 * Show spinner instead of Confirm button and disable Cancel button
 */
function hideLoading () {
  const domCache = this._domCache
  if (!this.params.showConfirmButton) {
    dom.hide(domCache.confirmButton)
    if (!this.params.showCancelButton) {
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
