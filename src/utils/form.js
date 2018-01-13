import { swalClasses } from './classes'

export const baseInput = {
  label: '',
  placeholder: '',
  type: '', // text, textarea, select, file, range, checkbox, radio
  value: '',
  options: {}, // For select. checkbox, radio
  config: {}, // Input specific config (currently only for range)
  validator () {},
  attributes: {},
  classes: '',
  events: {} // Attach custom events to each input (change, keyup, focus, hover)
}

/**
 * Build the form using provided inputs
 *
 * @param inputs
 */
export const build = (inputs) => {
  inputs
    .map((input) => Object.assign({}, baseInput, input))
    .forEach(addControl)
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
 * @return {HTMLDivElement}
 */
export const createControlWrapper = () => {
  let inputContainer = document.createElement('div')
  inputContainer.classList.add(swalClasses['form-control'])

  return inputContainer
}

/**
 * Create a label
 *
 * @param label
 *
 * @return {HTMLLabelElement}
 */
export const createLabel = (label) => {
  let element = document.createElement('label')
  element.textContent = label

  return element
}

/**
 * Add a single input element to the dom
 *
 * @param control
 */
export const addFormControlToDom = (control) => {
  document.getElementsByClassName(swalClasses['inputs-wrapper'])[0].appendChild(control)
}

/**
 * Generate a base control element. Here we can attach
 * anything common to all inputs
 *
 * @param tag
 * @param controlObject
 *
 * @return {HTMLElement}
 */
export const createBaseControl = (tag, controlObject) => {
  let input = document.createElement(tag)

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
 * @param {object} controlObject
 *
 * @return {HTMLElement}
 */
export const createRange = (controlObject) => {
  let inputContainer = document.createElement('div')
  inputContainer.classList.add(swalClasses.range)

  let output = document.createElement('output')
  inputContainer.appendChild(output)

  let input = document.createElement('input')
  input.type = controlObject.type
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
 * @param controlObject
 *
 * @return {HTMLElement}
 */
export const createTextarea = (controlObject) => {
  let input = createBaseControl('textarea', controlObject)

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
 * Create a select element
 *
 * @param controlObject
 *
 * @return {HTMLElement}
 */
export const createSelect = (controlObject) => {
  let input = createBaseControl('select', controlObject)

  // If placeholder provided, we'll add an
  // initial unselectabble option to the select
  if (controlObject.placeholder) {
    let option = document.createElement('option')

    option.textContent = controlObject.placeholder
    option.disabled = true
    option.selected = true

    input.appendChild(option)
  }

  // Add each option to the select
  for (let option in controlObject.options) {
    let optionElement = document.createElement('option')

    optionElement.value = option
    optionElement.textContent = controlObject.options[option]

    input.appendChild(optionElement)
  }

  if (typeof controlObject.value !== 'undefined') {
    input.value = controlObject.value
  }

  return input
}

/**
 * Create a file input element
 *
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
 * @param controlObject
 */
export const createRadio = (controlObject) => {
  let inputOuterContainer = document.createElement('div')
  inputOuterContainer.classList.add(swalClasses[`${controlObject.type}-input-container`])

  // Add each option to the select
  for (let option in controlObject.options) {
    let inputContainer = document.createElement('div')
    inputContainer.classList.add(swalClasses[`${controlObject.type}-input`])

    let label = createLabel(controlObject.options[option])

    let input = createBaseControl('input', controlObject)
    input.type = controlObject.type
    input.value = option

    // Build up the input within the container
    inputContainer.appendChild(input)
    inputContainer.appendChild(label)
    inputOuterContainer.appendChild(inputContainer)
  }

  return inputOuterContainer
}

/**
 * Add a control to the dom
 *
 * @param controlObject
 */
export const addControl = (controlObject) => {
  let inputContainer = createControlWrapper()

  if (controlObject.label) {
    inputContainer.appendChild(createLabel(controlObject.label))
  }

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
      console.log('err')
      return
  }

  inputContainer.appendChild(control)
  addFormControlToDom(inputContainer)
}
