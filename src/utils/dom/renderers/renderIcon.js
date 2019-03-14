import { swalClasses, iconTypes } from '../../classes.js'
import { error } from '../../utils.js'
import * as dom from '../../dom/index.js'
import sweetAlert from '../../../sweetalert2.js'

export const renderIcon = (params) => {
  const icons = dom.getIcons()
  for (let i = 0; i < icons.length; i++) {
    dom.hide(icons[i])
  }
  if (params.type) {
    if (Object.keys(iconTypes).indexOf(params.type) !== -1) {
      const icon = sweetAlert.getPopup().querySelector(`.${swalClasses.icon}.${iconTypes[params.type]}`)
      dom.show(icon)

      // Custom class
      if (params.customClass) {
        dom.addClass(icon, params.customClass.icon)
      }

      // Animate icon
      if (params.animation) {
        dom.addClass(icon, `swal2-animate-${params.type}-icon`)
      }
    } else {
      error(`Unknown type! Expected "success", "error", "warning", "info" or "question", got "${params.type}"`)
    }
  }
}
