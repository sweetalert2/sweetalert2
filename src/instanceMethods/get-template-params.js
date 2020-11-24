import { capitalizeFirstLetter } from '../utils/utils.js'

export const getTemplateParams = (params) => {
  if (!params.template) {
    return {}
  }

  const template =
    params.template.content ||
    params.template // IE11

  return Object.assign(
    getImageParams(template),
    getSimpleBlockParams(template, 'title', 'title'),
    getSimpleBlockParams(template, 'content', 'html'),
    getSimpleBlockParams(template, 'footer', 'footer'),
    getButtonParams(template, 'confirm'),
    getButtonParams(template, 'cancel'),
    getButtonParams(template, 'deny'),
    getAttributesParams(params.template)
  )
}

const getImageParams = (template) => {
  const params = {}
  const image = template.querySelector('img')
  if (image) {
    params.imageUrl = image.getAttribute('src')
    params.imageWidth = image.getAttribute('width')
    params.imageHeight = image.getAttribute('height')
    params.imageAlt = image.getAttribute('alt')
  }
  return params
}

const getButtonParams = (template, buttonName) => {
  const params = {}
  const button = template.querySelector(`${buttonName}-button`)
  if (button) {
    params[`show${capitalizeFirstLetter(buttonName)}Button`] = true
    params[`${buttonName}ButtonText`] = button.innerHTML.trim()
    params[`${buttonName}ButtonColor`] = button.getAttribute('color')
  }
  return params
}

const getSimpleBlockParams = (template, tagName, paramName) => {
  const params = {}
  const content = template.querySelector(tagName)
  if (content) {
    params[paramName] = content.innerHTML.trim()
  }
  return params
}

const getAttributesParams = (template) => {
  const result = {}
  const params = ['icon', 'toast', 'width', 'timer']
  for (const i in params) {
    const param = template.getAttribute(params[i])
    if (param) {
      result[params[i]] = param
    }
  }
  return result
}
