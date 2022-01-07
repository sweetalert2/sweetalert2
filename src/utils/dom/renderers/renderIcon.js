import { swalClasses, iconTypes } from '../../classes.js'
import { error } from '../../utils.js'
import * as dom from '../../dom/index.js'
import privateProps from '../../../privateProps.js'

export const renderIcon = (instance, params) => {
  const innerParams = privateProps.innerParams.get(instance)
  const icon = dom.getIcon()

  // if the given icon already rendered, apply the styling without re-rendering the icon
  if (innerParams && params.icon === innerParams.icon) {
    // Custom or default content
    setContent(icon, params)

    applyStyles(icon, params)
    return
  }

  if (!params.icon && !params.iconHtml) {
    return dom.hide(icon)
  }

  if (params.icon && Object.keys(iconTypes).indexOf(params.icon) === -1) {
    error(`Unknown icon! Expected "success", "error", "warning", "info" or "question", got "${params.icon}"`)
    return dom.hide(icon)
  }

  dom.show(icon)

  // Custom or default content
  setContent(icon, params)

  applyStyles(icon, params)

  // Animate icon
  dom.addClass(icon, params.showClass.icon)
}

const applyStyles = (icon, params) => {
  for (const iconType in iconTypes) {
    if (params.icon !== iconType) {
      dom.removeClass(icon, iconTypes[iconType])
    }
  }
  dom.addClass(icon, iconTypes[params.icon])

  // Icon color
  setColor(icon, params)

  // Success icon background color
  adjustSuccessIconBackgroundColor()

  // Custom class
  dom.applyCustomClass(icon, params, 'icon')
}

// Adjust success icon background color to match the popup background color
const adjustSuccessIconBackgroundColor = () => {
  const popup = dom.getPopup()
  const popupBackgroundColor = window.getComputedStyle(popup).getPropertyValue('background-color')
  const successIconParts = popup.querySelectorAll('[class^=swal2-success-circular-line], .swal2-success-fix')
  for (let i = 0; i < successIconParts.length; i++) {
    successIconParts[i].style.backgroundColor = popupBackgroundColor
  }
}

const setContent = (icon, params) => {
  icon.textContent = ''

  if (params.iconHtml) {
    dom.setInnerHtml(icon, iconContent(params.iconHtml))
  } else if (params.icon === 'success') {
    dom.setInnerHtml(icon, `
      <div class="swal2-success-circular-line-left"></div>
      <span class="swal2-success-line-tip"></span> <span class="swal2-success-line-long"></span>
      <div class="swal2-success-ring"></div> <div class="swal2-success-fix"></div>
      <div class="swal2-success-circular-line-right"></div>
    `)
  } else if (params.icon === 'error') {
    dom.setInnerHtml(icon, `
      <span class="swal2-x-mark">
        <span class="swal2-x-mark-line-left"></span>
        <span class="swal2-x-mark-line-right"></span>
      </span>
    `)
  } else {
    const defaultIconHtml = {
      question: '?',
      warning: '!',
      info: 'i'
    }
    dom.setInnerHtml(icon, iconContent(defaultIconHtml[params.icon]))
  }
}

const setColor = (icon, params) => {
  if (!params.iconColor) {
    return
  }
  icon.style.color = params.iconColor
  icon.style.borderColor = params.iconColor
  for (const sel of ['.swal2-success-line-tip', '.swal2-success-line-long', '.swal2-x-mark-line-left', '.swal2-x-mark-line-right']) {
    dom.setStyle(icon, sel, 'backgroundColor', params.iconColor)
  }
  dom.setStyle(icon, '.swal2-success-ring', 'borderColor', params.iconColor)
}

const iconContent = (content) => `<div class="${swalClasses['icon-content']}">${content}</div>`
