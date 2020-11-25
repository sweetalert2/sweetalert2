import defaultParams from '../utils/params.js'
import { toArray, capitalizeFirstLetter } from '../utils/utils.js'

export const getTemplateParams = (params) => {
  const template = typeof params.template === 'string' ? document.querySelector(params.template) : params.template
  if (!template) {
    return {}
  }
  const templateContent = template.content || template // IE11

  const result = Object.assign(
    getSwalParams(templateContent),
    getSwalButtons(templateContent),
    getSwalImage(templateContent),
    getSwalIcon(templateContent),
    getSwalInput(templateContent),
    getSwalStringParams(templateContent, ['title', 'html', 'footer']),
  )
  return result
}

const getSwalParams = (templateContent) => {
  const result = {}
  toArray(templateContent.querySelectorAll('swal-param')).forEach((param) => {
    const paramName = param.getAttribute('name')
    let value = param.getAttribute('value')
    if (typeof defaultParams[paramName] === 'boolean' && value === 'false') {
      value = false
    }
    if (typeof defaultParams[paramName] === 'object') {
      value = (new Function(`return ${value}`))() // eslint-disable-line no-new-func
    }
    result[paramName] = value
  })
  return result
}

const getSwalButtons = (templateContent) => {
  const result = {}
  toArray(templateContent.querySelectorAll('swal-button')).forEach((button) => {
    const type = button.getAttribute('type')
    const color = button.getAttribute('color')
    const ariaLabel = button.getAttribute('aria-label')
    result[`${type}ButtonText`] = button.innerHTML
    result[`show${capitalizeFirstLetter(type)}Button`] = true
    if (color) {
      result[`${type}ButtonColor`] = color
    }
    result[`${type}ButtonAriaLabel`] = ariaLabel
  })
  return result
}

const getSwalImage = (templateContent) => {
  const result = {}
  const image = templateContent.querySelector('swal-image')
  if (image) {
    result.imageUrl = image.getAttribute('src')
    result.imageWidth = image.getAttribute('width')
    result.imageHeight = image.getAttribute('height')
    result.imageAlt = image.getAttribute('alt')
  }
  return result
}

const getSwalIcon = (templateContent) => {
  const result = {}
  const icon = templateContent.querySelector('swal-icon')
  if (icon) {
    result.icon = icon.getAttribute('type')
    result.iconColor = icon.getAttribute('color')
    result.iconHtml = icon.innerHTML
  }
  return result
}

const getSwalInput = (templateContent) => {
  const result = {}
  const input = templateContent.querySelector('swal-input')
  if (input) {
    result.input = input.getAttribute('type')
    result.inputLabel = input.getAttribute('label')
    result.inputPlaceholder = input.getAttribute('placeholder')
    result.inputLabel = input.getAttribute('label')
    result.inputValue = input.getAttribute('value')
  }
  const inputOptions = templateContent.querySelectorAll('swal-input-option')
  if (inputOptions.length) {
    result.inputOptions = {}
    toArray(inputOptions).forEach((option) => {
      const optionValue = option.getAttribute('value')
      const optionName = option.innerHTML
      result.inputOptions[optionValue] = optionName
    })
  }
  return result
}

const getSwalStringParams = (templateContent, paramNames) => {
  const result = {}
  for (const i in paramNames) {
    const paramName = paramNames[i]
    const tag = templateContent.querySelector(`swal-${paramName}`)
    if (tag) {
      result[paramName] = tag.innerHTML
    }
  }
  return result
}
