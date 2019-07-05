import { swalClasses } from '../../classes.js'
import { warn, error, isPromise } from '../../utils.js'
import * as dom from '../../dom/index.js'
import privateProps from '../../../privateProps.js'

const inputTypes = ['input', 'file', 'range', 'select', 'radio', 'checkbox', 'textarea']

export const renderInput = (instance, params) => {
  const content = dom.getContent()
  const innerParams = privateProps.innerParams.get(instance)
  const rerender = !innerParams || params.input !== innerParams.input

  inputTypes.forEach((inputType) => {
    const inputClass = swalClasses[inputType]
    const inputContainer = dom.getChildByClass(content, inputClass)

    // set attributes
    setAttributes(inputType, params.inputAttributes)

    // set class
    setClass(inputContainer, inputClass, params)

    if (rerender) {
      dom.hide(inputContainer)
    }
  })

  if (params.input && rerender) {
    showInput(params)
  }
}

const showInput = (params) => {
  if (!renderInputType[params.input]) {
    return error(`Unexpected type of input! Expected "text", "email", "password", "number", "tel", "select", "radio", "checkbox", "textarea", "file" or "url", got "${params.input}"`)
  }

  const input = renderInputType[params.input](params)
  dom.show(input)
}

const removeAttributes = (input) => {
  for (let i = 0; i < input.attributes.length; i++) {
    const attrName = input.attributes[i].name
    if (!['type', 'value', 'style'].includes(attrName)) {
      input.removeAttribute(attrName)
    }
  }
}

const setAttributes = (inputType, inputAttributes) => {
  const input = dom.getInput(dom.getContent(), inputType)
  if (!input) {
    return
  }

  removeAttributes(input)

  for (const attr in inputAttributes) {
    // Do not set a placeholder for <input type="range">
    // it'll crash Edge, #1298
    if (inputType === 'range' && attr === 'placeholder') {
      continue
    }

    input.setAttribute(attr, inputAttributes[attr])
  }
}

const setClass = (inputContainer, inputClass, params) => {
  inputContainer.className = inputClass
  if (params.inputClass) {
    dom.addClass(inputContainer, params.inputClass)
  }
  if (params.customClass) {
    dom.addClass(inputContainer, params.customClass.input)
  }
}

const setInputPlaceholder = (input, params) => {
  if (!input.placeholder || params.inputPlaceholder) {
    input.placeholder = params.inputPlaceholder
  }
}

const renderInputType = {}

renderInputType.text =
renderInputType.email =
renderInputType.password =
renderInputType.number =
renderInputType.tel =
renderInputType.url = (params) => {
  const input = dom.getChildByClass(dom.getContent(), swalClasses.input)
  if (typeof params.inputValue === 'string' || typeof params.inputValue === 'number') {
    input.value = params.inputValue
  } else if (!isPromise(params.inputValue)) {
    warn(`Unexpected type of inputValue! Expected "string", "number" or "Promise", got "${typeof params.inputValue}"`)
  }
  setInputPlaceholder(input, params)
  input.type = params.input
  return input
}

renderInputType.file = (params) => {
  const input = dom.getChildByClass(dom.getContent(), swalClasses.file)
  setInputPlaceholder(input, params)
  input.type = params.input
  return input
}

renderInputType.range = (params) => {
  const range = dom.getChildByClass(dom.getContent(), swalClasses.range)
  const rangeInput = range.querySelector('input')
  const rangeOutput = range.querySelector('output')
  rangeInput.value = params.inputValue
  rangeInput.type = params.input
  rangeOutput.value = params.inputValue
  return range
}

renderInputType.select = (params) => {
  const select = dom.getChildByClass(dom.getContent(), swalClasses.select)
  select.innerHTML = ''
  if (params.inputPlaceholder) {
    const placeholder = document.createElement('option')
    placeholder.innerHTML = params.inputPlaceholder
    placeholder.value = ''
    placeholder.disabled = true
    placeholder.selected = true
    select.appendChild(placeholder)
  }
  return select
}

renderInputType.radio = () => {
  const radio = dom.getChildByClass(dom.getContent(), swalClasses.radio)
  radio.innerHTML = ''
  return radio
}

renderInputType.checkbox = (params) => {
  const checkbox = dom.getChildByClass(dom.getContent(), swalClasses.checkbox)
  const checkboxInput = dom.getInput(dom.getContent(), 'checkbox')
  checkboxInput.type = 'checkbox'
  checkboxInput.value = 1
  checkboxInput.id = swalClasses.checkbox
  checkboxInput.checked = Boolean(params.inputValue)
  const label = checkbox.querySelector('span')
  label.innerHTML = params.inputPlaceholder
  return checkbox
}

renderInputType.textarea = (params) => {
  const textarea = dom.getChildByClass(dom.getContent(), swalClasses.textarea)
  textarea.value = params.inputValue
  setInputPlaceholder(textarea, params)
  return textarea
}
