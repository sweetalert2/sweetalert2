import * as dom from '../utils/dom/index.js'
import * as domUtils from '../utils/dom/domUtils.js'

export {
  getContainer,
  getPopup,
  getTitle,
  getContent,
  getHtmlContainer,
  getImage,
  getIcon,
  getInputLabel,
  getCloseButton,
  getActions,
  getConfirmButton,
  getDenyButton,
  getCancelButton,
  getLoader,
  getHeader,
  getFooter,
  getTimerProgressBar,
  getFocusableElements,
  getValidationMessage,
  isLoading
} from '../utils/dom/index.js'

/*
 * Global function to determine if SweetAlert2 popup is shown
 */
export const isVisible = () => {
  return domUtils.isVisible(dom.getPopup())
}

/*
 * Global function to click 'Confirm' button
 */
export const clickConfirm = () => dom.getConfirmButton() && dom.getConfirmButton().click()

/*
 * Global function to click 'Deny' button
 */
export const clickDeny = () => dom.getDenyButton() && dom.getDenyButton().click()

/*
 * Global function to click 'Cancel' button
 */
export const clickCancel = () => dom.getCancelButton() && dom.getCancelButton().click()
