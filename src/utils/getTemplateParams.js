import defaultParams from './params.js'
import { capitalizeFirstLetter, warn } from './utils.js'

const swalStringParams = ['swal-title', 'swal-html', 'swal-footer']

/**
 * @param {SweetAlertOptions} params
 * @returns {SweetAlertOptions}
 */
export const getTemplateParams = (params) => {
  const template =
    typeof params.template === 'string'
      ? /** @type {HTMLTemplateElement} */ (document.querySelector(params.template))
      : params.template
  if (!template) {
    return {}
  }
  /** @type {DocumentFragment} */
  const templateContent = template.content

  showWarningsForElements(templateContent)

  const result = Object.assign(
    getSwalParams(templateContent),
    getSwalFunctionParams(templateContent),
    getSwalButtons(templateContent),
    getSwalImage(templateContent),
    getSwalIcon(templateContent),
    getSwalInput(templateContent),
    getSwalStringParams(templateContent, swalStringParams)
  )
  return result
}

/**
 * @param {DocumentFragment} templateContent
 * @returns {Record<string, string | boolean | number>}
 */
const getSwalParams = (templateContent) => {
  /** @type {Record<string, string | boolean | number>} */
  const result = {}
  /** @type {HTMLElement[]} */
  const swalParams = Array.from(templateContent.querySelectorAll('swal-param'))
  swalParams.forEach((param) => {
    showWarningsForAttributes(param, ['name', 'value'])
    const paramName = /** @type {keyof SweetAlertOptions} */ (param.getAttribute('name'))
    const value = param.getAttribute('value')
    if (!paramName || !value) {
      return
    }
    if (typeof defaultParams[paramName] === 'boolean') {
      result[paramName] = value !== 'false'
    } else if (typeof defaultParams[paramName] === 'object') {
      result[paramName] = JSON.parse(value)
    } else {
      result[paramName] = value
    }
  })
  return result
}

/**
 * @param {DocumentFragment} templateContent
 * @returns {Record<string, () => void>}
 */
const getSwalFunctionParams = (templateContent) => {
  /** @type {Record<string, () => void>} */
  const result = {}
  /** @type {HTMLElement[]} */
  const swalFunctions = Array.from(templateContent.querySelectorAll('swal-function-param'))
  swalFunctions.forEach((param) => {
    const paramName = /** @type {keyof SweetAlertOptions} */ param.getAttribute('name')
    const value = param.getAttribute('value')
    if (!paramName || !value) {
      return
    }
    result[paramName] = new Function(`return ${value}`)()
  })
  return result
}

/**
 * @param {DocumentFragment} templateContent
 * @returns {Record<string, string | boolean>}
 */
const getSwalButtons = (templateContent) => {
  /** @type {Record<string, string | boolean>} */
  const result = {}
  /** @type {HTMLElement[]} */
  const swalButtons = Array.from(templateContent.querySelectorAll('swal-button'))
  swalButtons.forEach((button) => {
    showWarningsForAttributes(button, ['type', 'color', 'aria-label'])
    const type = button.getAttribute('type')
    if (!type || !['confirm', 'cancel', 'deny'].includes(type)) {
      return
    }
    result[`${type}ButtonText`] = button.innerHTML
    result[`show${capitalizeFirstLetter(type)}Button`] = true
    if (button.hasAttribute('color')) {
      result[`${type}ButtonColor`] = button.getAttribute('color')
    }
    if (button.hasAttribute('aria-label')) {
      result[`${type}ButtonAriaLabel`] = button.getAttribute('aria-label')
    }
  })
  return result
}

/**
 * @param {DocumentFragment} templateContent
 * @returns {Pick<SweetAlertOptions, 'imageUrl' | 'imageWidth' | 'imageHeight' | 'imageAlt'>}
 */
const getSwalImage = (templateContent) => {
  const result = {}
  /** @type {HTMLElement | null} */
  const image = templateContent.querySelector('swal-image')
  if (image) {
    showWarningsForAttributes(image, ['src', 'width', 'height', 'alt'])
    if (image.hasAttribute('src')) {
      result.imageUrl = image.getAttribute('src') || undefined
    }
    if (image.hasAttribute('width')) {
      result.imageWidth = image.getAttribute('width') || undefined
    }
    if (image.hasAttribute('height')) {
      result.imageHeight = image.getAttribute('height') || undefined
    }
    if (image.hasAttribute('alt')) {
      result.imageAlt = image.getAttribute('alt') || undefined
    }
  }
  return result
}

/**
 * @param {DocumentFragment} templateContent
 * @returns {object}
 */
const getSwalIcon = (templateContent) => {
  const result = {}
  /** @type {HTMLElement | null} */
  const icon = templateContent.querySelector('swal-icon')
  if (icon) {
    showWarningsForAttributes(icon, ['type', 'color'])
    if (icon.hasAttribute('type')) {
      result.icon = icon.getAttribute('type')
    }
    if (icon.hasAttribute('color')) {
      result.iconColor = icon.getAttribute('color')
    }
    result.iconHtml = icon.innerHTML
  }
  return result
}

/**
 * @param {DocumentFragment} templateContent
 * @returns {object}
 */
const getSwalInput = (templateContent) => {
  /** @type {object} */
  const result = {}
  /** @type {HTMLElement | null} */
  const input = templateContent.querySelector('swal-input')
  if (input) {
    showWarningsForAttributes(input, ['type', 'label', 'placeholder', 'value'])
    result.input = input.getAttribute('type') || 'text'
    if (input.hasAttribute('label')) {
      result.inputLabel = input.getAttribute('label')
    }
    if (input.hasAttribute('placeholder')) {
      result.inputPlaceholder = input.getAttribute('placeholder')
    }
    if (input.hasAttribute('value')) {
      result.inputValue = input.getAttribute('value')
    }
  }
  /** @type {HTMLElement[]} */
  const inputOptions = Array.from(templateContent.querySelectorAll('swal-input-option'))
  if (inputOptions.length) {
    result.inputOptions = {}
    inputOptions.forEach((option) => {
      showWarningsForAttributes(option, ['value'])
      const optionValue = option.getAttribute('value')
      if (!optionValue) {
        return
      }
      const optionName = option.innerHTML
      result.inputOptions[optionValue] = optionName
    })
  }
  return result
}

/**
 * @param {DocumentFragment} templateContent
 * @param {string[]} paramNames
 * @returns {Record<string, string>}
 */
const getSwalStringParams = (templateContent, paramNames) => {
  /** @type {Record<string, string>} */
  const result = {}
  for (const i in paramNames) {
    const paramName = paramNames[i]
    /** @type {HTMLElement | null} */
    const tag = templateContent.querySelector(paramName)
    if (tag) {
      showWarningsForAttributes(tag, [])
      result[paramName.replace(/^swal-/, '')] = tag.innerHTML.trim()
    }
  }
  return result
}

/**
 * @param {DocumentFragment} templateContent
 */
const showWarningsForElements = (templateContent) => {
  const allowedElements = swalStringParams.concat([
    'swal-param',
    'swal-function-param',
    'swal-button',
    'swal-image',
    'swal-icon',
    'swal-input',
    'swal-input-option',
  ])
  Array.from(templateContent.children).forEach((el) => {
    const tagName = el.tagName.toLowerCase()
    if (!allowedElements.includes(tagName)) {
      warn(`Unrecognized element <${tagName}>`)
    }
  })
}

/**
 * @param {HTMLElement} el
 * @param {string[]} allowedAttributes
 */
const showWarningsForAttributes = (el, allowedAttributes) => {
  Array.from(el.attributes).forEach((attribute) => {
    if (allowedAttributes.indexOf(attribute.name) === -1) {
      warn([
        `Unrecognized attribute "${attribute.name}" on <${el.tagName.toLowerCase()}>.`,
        `${
          allowedAttributes.length
            ? `Allowed attributes are: ${allowedAttributes.join(', ')}`
            : 'To set the value, use HTML within the element.'
        }`,
      ])
    }
  })
}
