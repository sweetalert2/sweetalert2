import { renderActions } from './renderActions'
import { renderContainer } from './renderContainer'
import { renderContent } from './renderContent'
import { renderFooter } from './renderFooter'
import { renderHeader } from './renderHeader'
import { renderPopup } from './renderPopup'

export const render = (instance, params) => {
  renderPopup(instance, params)
  renderContainer(instance, params)

  renderHeader(instance, params)
  renderContent(instance, params)
  renderActions(instance, params)
  renderFooter(instance, params)
}
