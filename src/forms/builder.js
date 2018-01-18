import { swalClasses, prefixItem } from '../utils/classes'
import { error } from '../utils/utils'
import formsApi from './api'
import baseInput from './base-input'

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
 * @return {HTMLDivElement}
 */
export const createControlWrapper = (name) => {
  let inputContainer = document.createElement('div')

  inputContainer.classList.add(swalClasses['form-control'])
  inputContainer.classList.add(prefixItem(`input-${name}`))

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
  let element = document.createElement('label')
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
export const createBaseControl = (tag, name, controlObject) => {
  let input = document.createElement(tag)
  input.name = name

  if (!swalClasses[tag] && !swalClasses[controlObject.type]) {
    input.classList.add(swalClasses.input)
  }
  if (swalClasses[tag] && !swalClasses[controlObject.type]) {
    input.classList.add(swalClasses[tag])
  }
  if (swalClasses[controlObject.type]) {
    input.classList.add(swalClasses[controlObject.type])
  }
  if (controlObject.classes) {
    controlObject.classes.split(' ').forEach((_class) => {
      input.classList.add(_class)
    })
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
export const createInput = (name, controlObject) => {
  let input = createBaseControl('input', name, controlObject)

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
export const createRange = (name, controlObject) => {
  let inputContainer = document.createElement('div')
  inputContainer.classList.add(swalClasses.range)

  let output = document.createElement('output')
  inputContainer.appendChild(output)

  let input = document.createElement('input')
  input.type = controlObject.type
  input.name = name
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
export const createTextarea = (name, controlObject) => {
  let input = createBaseControl('textarea', name, controlObject)

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
 * @param options
 *
 * @return {*}
 */
export const resolveOptions = (options) => {
  let optionsFetch = Promise.resolve({})

  if (options instanceof Promise) {
    optionsFetch = options
  } else if (typeof options === 'object') {
    optionsFetch = Promise.resolve(options)
  } else {
    return Promise.reject(`Unexpected type of options for input! Expected object or Promise, got ${typeof options}`)
  }

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
export const createSelect = (name, controlObject) => {
  let input = createBaseControl('select', name, controlObject)
  let isMultiple = Boolean(controlObject.config && controlObject.config.multiple)

  // If placeholder provided, we'll add an
  // initial unselectable option to the select
  if (controlObject.placeholder && !isMultiple) {
    let option = document.createElement('option')

    option.textContent = controlObject.placeholder
    option.disabled = true
    option.selected = true

    input.appendChild(option)
  }

  if (isMultiple) {
    input.multiple = isMultiple
  }

  resolveOptions(controlObject.options).then((options) => {
    // Add each option to the select
    for (let option in options) {
      let optionElement = document.createElement('option')

      optionElement.value = option
      optionElement.textContent = options[option]

      if (typeof controlObject.value !== 'undefined') {
        input.selected = option === controlObject.value
      }

      input.appendChild(optionElement)
    }
  }).catch(error)

  return input
}

/**
 * Create a file input element
 *
 * @param name
 * @param controlObject
 *
 * @return {HTMLElement}
 */
export const createFile = (name, controlObject) => {
  let input = createBaseControl('input', name, controlObject)
  input.type = controlObject.type

  return input
}

/**
 * Create a radio input element
 *
 * @param name
 * @param controlObject
 */
export const createRadio = (name, controlObject) => {
  let inputOuterContainer = document.createElement('div')
  inputOuterContainer.classList.add(swalClasses[`${controlObject.type}-input-container`])

  resolveOptions(controlObject.options).then((options) => {
    // Add each option to the select
    for (let option in options) {
      let inputContainer = document.createElement('div')
      inputContainer.classList.add(swalClasses[`${controlObject.type}-input`])

      let label = createLabel(name, options[option])

      let input = createBaseControl('input', name, controlObject)
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
export const createControl = (name, controlObject) => {
  let inputContainer = createControlWrapper(name)

  if (controlObject.label) {
    inputContainer.appendChild(createLabel(name, controlObject.label))
  }

  let control
  switch (controlObject.type) {
    case 'text':
    case 'email':
    case 'password':
    case 'number':
    case 'tel':
    case 'url':
      control = createInput(name, controlObject)
      break
    case 'textarea':
      control = createTextarea(name, controlObject)
      break
    case 'select':
      control = createSelect(name, controlObject)
      break
    case 'file':
      control = createFile(name, controlObject)
      break
    case 'range':
      control = createRange(name, controlObject)
      break
    case 'radio':
    case 'checkbox':
      control = createRadio(name, controlObject)
      break
    default:
      error(`Unexpected type of input! Expected "text", "email", "password", "number", "tel", "select", "radio", "checkbox", "textarea", "file" or "url", got "${controlObject.type}"`)
      return
  }

  inputContainer.appendChild(control)

  return inputContainer
}
