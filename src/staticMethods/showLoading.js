import Swal from '../sweetalert2.js'
import { swalClasses } from '../utils/classes.js'
import * as dom from '../utils/dom/index.js'

/**
 * Shows loader (spinner), this is useful with AJAX requests.
 * By default the loader be shown instead of the "Confirm" button.
 *
 * @param {HTMLButtonElement | null} [buttonToReplace]
 */
const showLoading = (buttonToReplace) => {
  let popup = dom.getPopup()
  if (!popup) {
    new Swal() // eslint-disable-line no-new
  }
  popup = dom.getPopup()
  if (!popup) {
    return
  }
  const loader = dom.getLoader()

  if (dom.isToast()) {
    dom.hide(dom.getIcon())
  } else {
    replaceButton(popup, buttonToReplace)
  }
  dom.show(loader)

  popup.setAttribute('data-loading', 'true')
  popup.setAttribute('aria-busy', 'true')
  popup.focus()
}

/**
 * @param {HTMLElement} popup
 * @param {HTMLButtonElement | null} [buttonToReplace]
 */
const replaceButton = (popup, buttonToReplace) => {
  const actions = dom.getActions()
  const loader = dom.getLoader()
  if (!actions || !loader) {
    return
  }

  if (!buttonToReplace && dom.isVisible(dom.getConfirmButton())) {
    buttonToReplace = dom.getConfirmButton()
  }

  dom.show(actions)
  if (buttonToReplace) {
    dom.hide(buttonToReplace)
    loader.setAttribute('data-button-to-replace', buttonToReplace.className)
    actions.insertBefore(loader, buttonToReplace)
  }
  dom.addClass([popup, actions], swalClasses.loading)
}

export { showLoading, showLoading as enableLoading }
