import * as dom from '../utils/dom/index.js'
import Swal from '../sweetalert2.js'
import { swalClasses } from '../utils/classes.js'

/**
 * Shows loader (spinner), this is useful with AJAX requests.
 * By default the loader be shown instead of the "Confirm" button.
 */
const showLoading = (buttonToReplace) => {
  let popup = dom.getPopup()
  if (!popup) {
    Swal.fire()
  }
  popup = dom.getPopup()
  const actions = dom.getActions()
  const loader = dom.getLoader()

  if (!buttonToReplace && dom.isVisible(dom.getConfirmButton())) {
    buttonToReplace = dom.getConfirmButton()
  }

  dom.show(actions)
  if (buttonToReplace) {
    dom.hide(buttonToReplace)
    loader.setAttribute('data-button-to-replace', buttonToReplace.className)
  }
  loader.parentNode.insertBefore(loader, buttonToReplace)
  dom.addClass([popup, actions], swalClasses.loading)

  dom.show(loader)

  popup.setAttribute('data-loading', true)
  popup.setAttribute('aria-busy', true)
  popup.focus()
}

export {
  showLoading,
  showLoading as enableLoading
}
