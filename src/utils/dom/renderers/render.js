import { renderActions } from './renderActions.js'
import { renderContainer } from './renderContainer.js'
import { renderContent } from './renderContent.js'
import { renderFooter } from './renderFooter.js'
import { renderHeader } from './renderHeader.js'
import { renderPopup } from './renderPopup.js'

export const render = (instance, params) => {
  renderPopup(instance, params)
  renderContainer(instance, params)

  renderHeader(instance, params)
  renderContent(instance, params)
  renderActions(instance, params)
  renderFooter(instance, params)
}
