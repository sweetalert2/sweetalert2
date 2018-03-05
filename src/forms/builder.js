import { prefixItem, swalClasses } from '../utils/classes'
import { error } from '../utils/utils'
import formsApi from './api'
import baseInput from './base-input'
import { addClass, createEl, getControlWrapper, removeClass } from '../utils/dom'

/**
 * Build the form using provided inputs
 *
 * @param inputs
 */
export const build = (inputs) => {
  Object.keys(inputs)
    .forEach((input) => {
      inputs[input] = Object.assign({}, baseInput, inputs[input])
      formsApi.addInput(input, inputs[input])
    })
}

/**
 * Add all provided attributes to an input
 *
 * @param input
 * @param attributes
 *
 * @return {HTMLElement}
 */
export const addInputAttributes = (input, attributes = {}) => {
  for (let attr in attributes) {
    input.setAttribute(attr, attributes[attr])
  }

  return input
}

/**
 * Create a basic control wrapper for a form element
 *
 * @param name
 *
 * @param label
 * @return {HTMLDivElement}
 */
export const createControlWrapper = ({ name, label }) => {
  let inputContainer = createEl('div', [
    prefixItem('form-control'),
    prefixItem(`input-${name}`)
  ])

  let loadingIconContainer = createEl('div', [
    prefixItem('loading-icon-container')
  ])

  let loadingIcon = createEl('div', [
    prefixItem('loading-icon')
  ])

  loadingIconContainer.appendChild(loadingIcon)

  if (label) {
    inputContainer.appendChild(createLabel(name, label))
  }

  inputContainer.appendChild(loadingIconContainer)

  return inputContainer
}

/**
 * Create a label
 *
 * @param name
 * @param label
 *
 * @return {HTMLLabelElement}
 */
export const createLabel = (name, label) => {
  let element = createEl('label')
  element.textContent = label
  element.for = name

  return element
}

/**
 * Generate a base control element. Here we can attach
 * anything common to all inputs
 *
 * @param tag
 * @param name
 * @param controlObject
 *
 * @return {HTMLElement}
 */
export const createBaseControl = (tag, controlObject) => {
  let input = createEl(tag)
  input.name = controlObject.name

  // Some input types have different predefined classes
  if (!swalClasses[tag] && !swalClasses[controlObject.type]) {
    addClass(input, swalClasses.input)
  }
  if (swalClasses[tag] && !swalClasses[controlObject.type]) {
    addClass(input, swalClasses[tag])
  }
  if (swalClasses[controlObject.type]) {
    addClass(input, swalClasses[controlObject.type])
  }
  if (controlObject.classes) {
    addClass(input, controlObject.classes.split(' '))
  }

  input = addInputAttributes(input, controlObject.attributes)

  return input
}

/**
 * Create an input element
 *
 * @param name
 * @param {object} controlObject
 *
 * @return {HTMLElement}
 */
export const createInput = (controlObject) => {
  let input = createBaseControl('input', controlObject)

  if (controlObject.placeholder) {
    input.placeholder = controlObject.placeholder
  }
  input.type = controlObject.type
  if (typeof controlObject.value !== 'undefined') {
    input.value = controlObject.value
  }

  return input
}

/**
 * Create a range input element
 *
 * @param name
 * @param {object} controlObject
 *
 * @return {HTMLElement}
 */
export const createRange = (controlObject) => {
  let inputContainer = createEl('div', prefixItem('range'))

  let output = createEl('output')
  inputContainer.appendChild(output)

  let input = createEl('input')
  input.type = controlObject.type
  input.name = controlObject.name
  if (typeof controlObject.value !== 'undefined') {
    input.value = controlObject.value
  }
  input.min = controlObject.config.min
  input.max = controlObject.config.max
  input.step = controlObject.config.step
  output.value = input.value

  input.oninput = () => {
    output.value = input.value
  }

  inputContainer.appendChild(input)

  return inputContainer
}

/**
 * Create a textarea element
 *
 * @param name
 * @param controlObject
 *
 * @return {HTMLElement}
 */
export const createTextarea = (controlObject) => {
  let input = createBaseControl('textarea', controlObject.name)

  if (controlObject.placeholder) {
    input.placeholder = controlObject.placeholder
  }
  input.type = controlObject.type
  if (typeof controlObject.value !== 'undefined') {
    input.value = controlObject.value
  }

  return input
}

/**
 * Resolve all option types as a promise for consistent handling
 *
 * @param name
 * @param options
 *
 * @return {*}
 */
export const resolveOptions = ({ options, name }) => {
  let optionsFetch = Promise.resolve({})

  if (options instanceof Promise) {
    optionsFetch = options
  } else if (typeof options === 'object') {
    optionsFetch = Promise.resolve(options)
  } else {
    return Promise.reject(`Unexpected type of options for input! Expected object or Promise, got ${typeof options}`)
  }

  optionsFetch.then((options) => {
    disableInputLoading(name)

    return options
  })

  return optionsFetch
}

/**
 * Create a select element
 *
 * @param name
 * @param controlObject
 *
 * @return {HTMLElement}
 */
export const createSelect = (controlObject) => {
  let input = createBaseControl('select', controlObject)
  let isMultiple = Boolean(controlObject.config && controlObject.config.multiple)

  let inputOuterContainer = createEl('div', [
    prefixItem(`${controlObject.type}-input-container`)
  ])

  // If placeholder provided, we'll add an
  // initial unselectable option to the select
  if (controlObject.placeholder && !isMultiple) {
    let option = createEl('option')

    option.textContent = controlObject.placeholder
    option.disabled = true
    option.selected = true

    input.appendChild(option)
  }

  if (isMultiple) {
    input.multiple = isMultiple
  }

  resolveOptions(controlObject).then((options) => {
    // Add each option to the select
    for (let option in options) {
      let optionElement = createEl('option')

      optionElement.value = option
      optionElement.textContent = options[option]

      if (typeof controlObject.value !== 'undefined') {
        input.selected = option === controlObject.value
      }

      input.appendChild(optionElement)
    }
    inputOuterContainer.appendChild(input)
  }).catch(error)

  return inputOuterContainer
}

/**
 * Enable the loading state on an input
 *
 * @param name
 */
export const enableInputLoading = (name) => {
  addClass(
    getControlWrapper(name).querySelector('.' + prefixItem('loading-icon')),
    prefixItem('loading')
  )
}

/**
 * Disable the loading state on an input
 *
 * @param name
 */
export const disableInputLoading = (name) => {
  removeClass(
    getControlWrapper(name).querySelector('.' + prefixItem('loading-icon')),
    prefixItem('loading'),
  )
}

/**
 * Create a file input element
 *
 * @param name
 * @param controlObject
 *
 * @return {HTMLElement}
 */
export const createFile = (controlObject) => {
  let input = createBaseControl('input', controlObject)
  input.type = controlObject.type

  return input
}

/**
 * Create a radio input element
 *
 * @param name
 * @param controlObject
 */
export const createRadio = (controlObject) => {
  let inputOuterContainer = createEl('div', [
    prefixItem(`${controlObject.type}-input-container`)
  ])

  resolveOptions(controlObject).then((options) => {
    // Add each option to the select
    for (let option in options) {
      let inputContainer = createEl('div', [
        prefixItem(`${controlObject.type}-input`)
      ])

      let label = createLabel(controlObject.name, options[option])

      let input = createBaseControl('input', controlObject)
      input.type = controlObject.type
      input.value = option

      // Build up the input within the container
      inputContainer.appendChild(input)
      inputContainer.appendChild(label)
      inputOuterContainer.appendChild(inputContainer)
    }
  })

  return inputOuterContainer
}

/**
 * Create a form control from the provided controlObject
 *
 * @param name
 * @param controlObject
 *
 * @return {*}
 */
export const createControl = (controlObject) => {
  let inputContainer = createControlWrapper(controlObject)

  let control
  switch (controlObject.type) {
    case 'text':
    case 'email':
    case 'password':
    case 'number':
    case 'tel':
    case 'url':
      control = createInput(controlObject)
      break
    case 'textarea':
      control = createTextarea(controlObject)
      break
    case 'select':
      control = createSelect(controlObject)
      break
    case 'file':
      control = createFile(controlObject)
      break
    case 'range':
      control = createRange(controlObject)
      break
    case 'radio':
    case 'checkbox':
      control = createRadio(controlObject)
      break
    default:
      error(`Unexpected type of input! Expected "text", "email", "password", "number", "tel", "select", "radio", "checkbox", "textarea", "file" or "url", got "${controlObject.type}"`)
      return
  }

  inputContainer.appendChild(control)

  return inputContainer
}
