import * as dom from '../utils/dom/index.js'

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
  let isVisible = false
  const swalPopup = dom.getPopup()
  if (swalPopup) {
    const swalPopupComputedStyle = window.getComputedStyle(swalPopup)
    isVisible = !(swalPopupComputedStyle.display === 'none' || swalPopupComputedStyle.visibility === 'hidden' || swalPopupComputedStyle.opacity === '0')
  }
  return isVisible
}

/*
 * Global function to click 'Confirm' button
 */
export const clickConfirm = () => dom.getConfirmButton().click()

/*
 * Global function to click 'Cancel' button
 */
export const clickCancel = () => dom.getCancelButton().click()
