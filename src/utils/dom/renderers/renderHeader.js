import * as dom from '../../dom/index.js'
import { renderCloseButton } from './renderCloseButton'
import { renderIcon } from './renderIcon'
import { renderImage } from './renderImage'
import { renderProgressSteps } from './renderProgressSteps'
import { renderTitle } from './renderTitle'

export const renderHeader = (instance, params) => {
  const header = dom.getHeader()

  // Custom class
  dom.applyCustomClass(header, params.customClass, 'header')

  // Progress steps
  renderProgressSteps(instance, params)

  // Icon
  renderIcon(instance, params)

  // Image
  renderImage(instance, params)

  // Title
  renderTitle(instance, params)

  // Close button
  renderCloseButton(instance, params)
}
