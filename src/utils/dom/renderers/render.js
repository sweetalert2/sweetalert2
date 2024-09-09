import globalState from '../../../globalState.js'
import { getPopup } from '../getters.js'
import { renderActions } from './renderActions.js'
import { renderCloseButton } from './renderCloseButton.js'
import { renderContainer } from './renderContainer.js'
import { renderContent } from './renderContent.js'
import { renderFooter } from './renderFooter.js'
import { renderIcon } from './renderIcon.js'
import { renderImage } from './renderImage.js'
import { renderPopup } from './renderPopup.js'
import { renderProgressSteps } from './renderProgressSteps.js'
import { renderTitle } from './renderTitle.js'

/**
 * @param {SweetAlert} instance
 * @param {SweetAlertOptions} params
 */
export const render = (instance, params) => {
  renderPopup(instance, params)
  renderContainer(instance, params)

  renderProgressSteps(instance, params)
  renderIcon(instance, params)
  renderImage(instance, params)
  renderTitle(instance, params)
  renderCloseButton(instance, params)

  renderContent(instance, params)
  renderActions(instance, params)
  renderFooter(instance, params)

  const popup = getPopup()
  if (typeof params.didRender === 'function' && popup) {
    params.didRender(popup)
  }
  globalState.eventEmitter.emit('didRender', popup)
}
