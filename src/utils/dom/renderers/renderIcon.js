import privateProps from '../../../privateProps.js'
import { iconTypes, swalClasses } from '../../classes.js'
import * as dom from '../../dom/index.js'
import { error } from '../../utils.js'

/**
 * @param {SweetAlert} instance
 * @param {SweetAlertOptions} params
 */
export const renderIcon = (instance, params) => {
  const innerParams = privateProps.innerParams.get(instance)
  const icon = dom.getIcon()
  if (!icon) {
    return
  }

  // if the given icon already rendered, apply the styling without re-rendering the icon
  if (innerParams && params.icon === innerParams.icon) {
    // Custom or default content
    setContent(icon, params)

    applyStyles(icon, params)
    return
  }

  if (!params.icon && !params.iconHtml) {
    dom.hide(icon)
    return
  }

  if (params.icon && Object.keys(iconTypes).indexOf(params.icon) === -1) {
    error(`Unknown icon! Expected "success", "error", "warning", "info" or "question", got "${params.icon}"`)
    dom.hide(icon)
    return
  }

  dom.show(icon)

  // Custom or default content
  setContent(icon, params)

  applyStyles(icon, params)

  // Animate icon
  dom.addClass(icon, params.showClass && params.showClass.icon)

  // Re-adjust the success icon on system theme change
  const colorSchemeQueryList = window.matchMedia('(prefers-color-scheme: dark)');
  colorSchemeQueryList.addEventListener('change', adjustSuccessIconBackgroundColor);
}

/**
 * @param {HTMLElement} icon
 * @param {SweetAlertOptions} params
 */
const applyStyles = (icon, params) => {
  for (const [iconType, iconClassName] of Object.entries(iconTypes)) {
    if (params.icon !== iconType) {
      dom.removeClass(icon, iconClassName)
    }
  }
  dom.addClass(icon, params.icon && iconTypes[params.icon])

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
  if (!popup) {
    return
  }
  const popupBackgroundColor = window.getComputedStyle(popup).getPropertyValue('background-color')
  /** @type {NodeListOf<HTMLElement>} */
  const successIconParts = popup.querySelectorAll('[class^=swal2-success-circular-line], .swal2-success-fix')
  for (let i = 0; i < successIconParts.length; i++) {
    successIconParts[i].style.backgroundColor = popupBackgroundColor
  }
}

const successIconHtml = `
  <div class="swal2-success-circular-line-left"></div>
  <span class="swal2-success-line-tip"></span> <span class="swal2-success-line-long"></span>
  <div class="swal2-success-ring"></div> <div class="swal2-success-fix"></div>
  <div class="swal2-success-circular-line-right"></div>
`

const errorIconHtml = `
  <span class="swal2-x-mark">
    <span class="swal2-x-mark-line-left"></span>
    <span class="swal2-x-mark-line-right"></span>
  </span>
`

/**
 * @param {HTMLElement} icon
 * @param {SweetAlertOptions} params
 */
const setContent = (icon, params) => {
  if (!params.icon && !params.iconHtml) {
    return
  }
  let oldContent = icon.innerHTML
  let newContent = ''
  if (params.iconHtml) {
    newContent = iconContent(params.iconHtml)
  } else if (params.icon === 'success') {
    newContent = successIconHtml
    oldContent = oldContent.replace(/ style=".*?"/g, '') // undo adjustSuccessIconBackgroundColor()
  } else if (params.icon === 'error') {
    newContent = errorIconHtml
  } else if (params.icon) {
    const defaultIconHtml = {
      question: '?',
      warning: '!',
      info: 'i',
    }
    newContent = iconContent(defaultIconHtml[params.icon])
  }

  if (oldContent.trim() !== newContent.trim()) {
    dom.setInnerHtml(icon, newContent)
  }
}

/**
 * @param {HTMLElement} icon
 * @param {SweetAlertOptions} params
 */
const setColor = (icon, params) => {
  if (!params.iconColor) {
    return
  }
  icon.style.color = params.iconColor
  icon.style.borderColor = params.iconColor
  for (const sel of [
    '.swal2-success-line-tip',
    '.swal2-success-line-long',
    '.swal2-x-mark-line-left',
    '.swal2-x-mark-line-right',
  ]) {
    dom.setStyle(icon, sel, 'background-color', params.iconColor)
  }
  dom.setStyle(icon, '.swal2-success-ring', 'border-color', params.iconColor)
}

/**
 * @param {string} content
 * @returns {string}
 */
const iconContent = (content) => `<div class="${swalClasses['icon-content']}">${content}</div>`
