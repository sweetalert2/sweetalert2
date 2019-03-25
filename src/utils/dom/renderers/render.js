import { renderActions } from './renderActions'
import { renderContainer } from './renderContainer'
import { renderContent } from './renderContent'
import { renderFooter } from './renderFooter'
import { renderHeader } from './renderHeader'
import { renderPopup } from './renderPopup'

export const render = (params) => {
  renderPopup(params)
  renderContainer(params)

  renderHeader(params)
  renderContent(params)
  renderActions(params)
  renderFooter(params)
}
