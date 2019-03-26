import { swalClasses } from '../../classes.js'
import { warn, error, isPromise } from '../../utils.js'
import * as dom from '../../dom/index.js'

export const renderInput = (params) => {
  const content = dom.getContent()
  const inputTypes = ['input', 'file', 'range', 'select', 'radio', 'checkbox', 'textarea']
  const setInputPlaceholder = (input) => {
    if (!input.placeholder || params.inputPlaceholder) {
      input.placeholder = params.inputPlaceholder
    }
  }
  let input
  for (let i = 0; i < inputTypes.length; i++) {
    const inputClass = swalClasses[inputTypes[i]]
    const inputContainer = dom.getChildByClass(content, inputClass)
    input = dom.getInput(content, inputTypes[i])

    // set attributes
    if (input) {
      for (let j in input.attributes) {
        if (input.attributes.hasOwnProperty(j)) {
          const attrName = input.attributes[j].name
          if (attrName !== 'type' && attrName !== 'value') {
            input.removeAttribute(attrName)
          }
        }
      }
      for (let attr in params.inputAttributes) {
        // Do not set a placeholder for <input type="range">
        // it'll crash Edge, #1298
        if (inputTypes[i] === 'range' && attr === 'placeholder') {
          continue
        }

        input.setAttribute(attr, params.inputAttributes[attr])
      }
    }

    // set class
    inputContainer.className = inputClass
    if (params.inputClass) {
      dom.addClass(inputContainer, params.inputClass)
    }
    if (params.customClass) {
      dom.addClass(inputContainer, params.customClass.input)
    }

    dom.hide(inputContainer)
  }

  switch (params.input) {
    case 'text':
    case 'email':
    case 'password':
    case 'number':
    case 'tel':
    case 'url': {
      input = dom.getChildByClass(content, swalClasses.input)
      if (typeof params.inputValue === 'string' || typeof params.inputValue === 'number') {
        input.value = params.inputValue
      } else if (!isPromise(params.inputValue)) {
        warn(`Unexpected type of inputValue! Expected "string", "number" or "Promise", got "${typeof params.inputValue}"`)
      }
      setInputPlaceholder(input)
      input.type = params.input
      dom.show(input)
      break
    }
    case 'file': {
      input = dom.getChildByClass(content, swalClasses.file)
      setInputPlaceholder(input)
      input.type = params.input
      dom.show(input)
      break
    }
    case 'range': {
      const range = dom.getChildByClass(content, swalClasses.range)
      const rangeInput = range.querySelector('input')
      const rangeOutput = range.querySelector('output')
      rangeInput.value = params.inputValue
      rangeInput.type = params.input
      rangeOutput.value = params.inputValue
      dom.show(range)
      break
    }
    case 'select': {
      const select = dom.getChildByClass(content, swalClasses.select)
      select.innerHTML = ''
      if (params.inputPlaceholder) {
        const placeholder = document.createElement('option')
        placeholder.innerHTML = params.inputPlaceholder
        placeholder.value = ''
        placeholder.disabled = true
        placeholder.selected = true
        select.appendChild(placeholder)
      }
      dom.show(select)
      break
    }
    case 'radio': {
      const radio = dom.getChildByClass(content, swalClasses.radio)
      radio.innerHTML = ''
      dom.show(radio)
      break
    }
    case 'checkbox': {
      const checkbox = dom.getChildByClass(content, swalClasses.checkbox)
      const checkboxInput = dom.getInput(content, 'checkbox')
      checkboxInput.type = 'checkbox'
      checkboxInput.value = 1
      checkboxInput.id = swalClasses.checkbox
      checkboxInput.checked = Boolean(params.inputValue)
      let label = checkbox.querySelector('span')
      label.innerHTML = params.inputPlaceholder
      dom.show(checkbox)
      break
    }
    case 'textarea': {
      const textarea = dom.getChildByClass(content, swalClasses.textarea)
      textarea.value = params.inputValue
      setInputPlaceholder(textarea)
      dom.show(textarea)
      break
    }
    case null: {
      break
    }
    default:
      error(`Unexpected type of input! Expected "text", "email", "password", "number", "tel", "select", "radio", "checkbox", "textarea", "file" or "url", got "${params.input}"`)
      break
  }
}
