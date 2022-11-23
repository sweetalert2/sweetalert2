import * as domUtils from '../utils/dom/domUtils.js'
import * as dom from '../utils/dom/index.js'

export {
  getContainer,
  getPopup,
  getTitle,
  getHtmlContainer,
  getImage,
  getIcon,
  getIconContent,
  getInputLabel,
  getCloseButton,
  getActions,
  getConfirmButton,
  getDenyButton,
  getCancelButton,
  getLoader,
  getFooter,
  getTimerProgressBar,
  getFocusableElements,
  getValidationMessage,
  getProgressSteps,
  isLoading,
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
