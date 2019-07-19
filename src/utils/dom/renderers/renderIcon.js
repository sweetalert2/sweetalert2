import { swalClasses, iconTypes } from '../../classes.js'
import { error } from '../../utils.js'
import * as dom from '../../dom/index.js'
import privateProps from '../../../privateProps.js'

export const renderIcon = (instance, params) => {
  const innerParams = privateProps.innerParams.get(instance)

  // if the icon with the given type already rendered,
  // apply the custom class without re-rendering the icon
  if (innerParams && params.type === innerParams.type && dom.getIcon()) {
    dom.applyCustomClass(dom.getIcon(), params.customClass, 'icon')
    return
  }

  hideAllIcons()

  if (!params.type) {
    return
  }

  if (Object.keys(iconTypes).indexOf(params.type) !== -1) {
    const icon = dom.elementBySelector(`.${swalClasses.icon}.${iconTypes[params.type]}`)

    dom.show(icon)

    // Custom or default content
    setContent(icon, params)

    adjustSuccessIconBackgoundColor()

    // Custom class
    dom.applyCustomClass(icon, params.customClass, 'icon')

    // Animate icon
    dom.toggleClass(icon, `swal2-animate-${params.type}-icon`, params.animation)
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

const setContent = (icon, params) => {
  icon.innerHTML = ''

  if (params.iconHtml) {
    icon.innerHTML = iconContent(params.iconHtml)
  } else if (params.type === 'success') {
    icon.innerHTML = `
      <div class="swal2-success-circular-line-left"></div>
      <span class="swal2-success-line-tip"></span> <span class="swal2-success-line-long"></span>
      <div class="swal2-success-ring"></div> <div class="swal2-success-fix"></div>
      <div class="swal2-success-circular-line-right"></div>
    `
  } else if (params.type === 'error') {
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
    icon.innerHTML = iconContent(defaultIconHtml[params.type])
  }
}

const iconContent = (content) => `<div class="${swalClasses['icon-content']}">${content}</div>`
