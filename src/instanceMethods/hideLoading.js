import * as dom from '../utils/dom/index.js'
import { swalClasses } from '../utils/classes.js'
import privateProps from '../privateProps.js'

/**
 * Hides loader and shows back the button which was hidden by .showLoading()
 */
function hideLoading() {
  // do nothing if popup is closed
  const innerParams = privateProps.innerParams.get(this)
  if (!innerParams) {
    return
  }
  const domCache = privateProps.domCache.get(this)
  dom.hide(domCache.loader)
  if (dom.isToast()) {
    if (innerParams.icon) {
      dom.show(dom.getIcon())
    }
  } else {
    showRelatedButton(domCache)
  }
  dom.removeClass([domCache.popup, domCache.actions], swalClasses.loading)
  domCache.popup.removeAttribute('aria-busy')
  domCache.popup.removeAttribute('data-loading')
  domCache.confirmButton.disabled = false
  domCache.denyButton.disabled = false
  domCache.cancelButton.disabled = false
}

const showRelatedButton = (domCache) => {
  const buttonToReplace = domCache.popup.getElementsByClassName(domCache.loader.getAttribute('data-button-to-replace'))
  if (buttonToReplace.length) {
    dom.show(buttonToReplace[0], 'inline-block')
  } else if (dom.allButtonsAreHidden()) {
    dom.hide(domCache.actions)
  }
}

export { hideLoading, hideLoading as disableLoading }
