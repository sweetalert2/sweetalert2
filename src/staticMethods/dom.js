import * as dom from '../utils/dom/index.js'
import * as domUtils from '../utils/dom/domUtils.js'

export {
  getContainer,
  getPopup,
  getTitle,
  getContent,
  getImage,
  getIcons,
  getCloseButton,
  getActions,
  getConfirmButton,
  getCancelButton,
  getFooter,
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
export const clickConfirm = () => dom.getConfirmButton().click()

/*
 * Global function to click 'Cancel' button
 */
export const clickCancel = () => dom.getCancelButton().click()
