import { swalClasses, iconTypes } from '../../classes.js'
import { error } from '../../utils.js'
import * as dom from '../../dom/index.js'
import privateProps from '../../../privateProps.js'

export const renderIcon = (instance, params) => {
  const innerParams = privateProps.innerParams.get(instance)

  // if the give icon already rendered, apply the custom class without re-rendering the icon
  if (innerParams && params.icon === innerParams.icon && dom.getIcon()) {
    dom.applyCustomClass(dom.getIcon(), params, 'icon')
    return
  }

  hideAllIcons()

  if (!params.icon) {
    return
  }

  if (Object.keys(iconTypes).indexOf(params.icon) !== -1) {
    const icon = dom.elementBySelector(`.${swalClasses.icon}.${iconTypes[params.icon]}`)
    dom.show(icon)

    // Custom or default content
    setContent(icon, params)
    adjustSuccessIconBackgoundColor()

    // Custom class
    dom.applyCustomClass(icon, params, 'icon')

    // Animate icon
    dom.addClass(icon, params.showClass.icon)
  } else {
    error(`Unknown icon! Expected "success", "error", "warning", "info" or "question", got "${params.icon}"`)
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

const setContent = (icon, params) => {
  icon.innerHTML = ''

  if (params.iconHtml) {
    icon.innerHTML = iconContent(params.iconHtml)
  } else if (params.icon === 'success') {
    icon.innerHTML = `
      <div class="swal2-success-circular-line-left"></div>
      <span class="swal2-success-line-tip"></span> <span class="swal2-success-line-long"></span>
      <div class="swal2-success-ring"></div> <div class="swal2-success-fix"></div>
      <div class="swal2-success-circular-line-right"></div>
    `
  } else if (params.icon === 'error') {
    icon.innerHTML = `
      <span class="swal2-x-mark">
        <span class="swal2-x-mark-line-left"></span>
        <span class="swal2-x-mark-line-right"></span>
      </span>
    `
  } else {
    const defaultIconHtml = {
      question: '?',
      warning: '!',
      info: 'i'
    }
    icon.innerHTML = iconContent(defaultIconHtml[params.icon])
  }
}

const iconContent = (content) => `<div class="${swalClasses['icon-content']}">${content}</div>`
