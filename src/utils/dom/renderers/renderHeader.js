import * as dom from '../../dom/index.js'
import { renderCloseButton } from './renderCloseButton.js'
import { renderIcon } from './renderIcon.js'
import { renderImage } from './renderImage.js'
import { renderProgressSteps } from './renderProgressSteps.js'
import { renderTitle } from './renderTitle.js'

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
