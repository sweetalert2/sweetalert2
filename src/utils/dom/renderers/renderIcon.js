import { swalClasses, iconTypes } from '../../classes.js'
import { error } from '../../utils.js'
import * as dom from '../../dom/index.js'

export const renderIcon = (params) => {
  hideAllIcons()

  if (!params.type) {
    return
  }

  adjustSuccessIconBackgoundColor()

  if (Object.keys(iconTypes).indexOf(params.type) !== -1) {
    const icon = dom.getPopup().querySelector(`.${swalClasses.icon}.${iconTypes[params.type]}`)
    dom.show(icon)

    // Custom class
    dom.applyCustomClass(icon, params.customClass, 'icon')

    // Animate icon
    if (params.animation) {
      dom.addClass(icon, `swal2-animate-${params.type}-icon`)
    }
  } else {
    error(`Unknown type! Expected "success", "error", "warning", "info" or "question", got "${params.type}"`)
  }
}

const hideAllIcons = () => {
  const icons = dom.getIcons()
  for (let i = 0; i < icons.length; i++) {
    dom.hide(icons[i])
  }
}

// Adjust success icon background color to match the popup background color
const adjustSuccessIconBackgoundColor = () => {
  const popup = dom.getPopup()
  const popupBackgroundColor = window.getComputedStyle(popup).getPropertyValue('background-color')
  const successIconParts = popup.querySelectorAll('[class^=swal2-success-circular-line], .swal2-success-fix')
  for (let i = 0; i < successIconParts.length; i++) {
    successIconParts[i].style.backgroundColor = popupBackgroundColor
  }
}
