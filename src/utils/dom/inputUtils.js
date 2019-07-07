import * as dom from './index.js'
import { swalClasses } from '../classes.js'
import { getChildByClass } from './domUtils.js'
import { error, isPromise } from '../utils.js'
import { showLoading } from '../../staticMethods/showLoading.js'

export const handleInputOptions = (instance, params) => {
  const content = dom.getContent()
  const processInputOptions = (inputOptions) => populateInputOptions[params.input](content, formatInputOptions(inputOptions), params)
  if (isPromise(params.inputOptions)) {
    showLoading()
    params.inputOptions.then((inputOptions) => {
      instance.hideLoading()
      processInputOptions(inputOptions)
    })
  } else if (typeof params.inputOptions === 'object') {
    processInputOptions(params.inputOptions)
  } else {
    error(`Unexpected type of inputOptions! Expected object, Map or Promise, got ${typeof params.inputOptions}`)
  }
}

export const handleInputValue = (instance, params) => {
  const input = instance.getInput()
  dom.hide(input)
  params.inputValue.then((inputValue) => {
    input.value = params.input === 'number' ? parseFloat(inputValue) || 0 : inputValue + ''
    dom.show(input)
    input.focus()
    instance.hideLoading()
  })
    .catch((err) => {
      error('Error in inputValue promise: ' + err)
      input.value = ''
      dom.show(input)
      input.focus()
      instance.hideLoading()
    })
}

const populateInputOptions = {
  select: (content, inputOptions, params) => {
    const select = getChildByClass(content, swalClasses.select)
    inputOptions.forEach(inputOption => {
      const optionValue = inputOption[0]
      const optionLabel = inputOption[1]
      const option = document.createElement('option')
      option.value = optionValue
      option.innerHTML = optionLabel
      if (params.inputValue.toString() === optionValue.toString()) {
        option.selected = true
      }
      select.appendChild(option)
    })
    select.focus()
  },

  radio: (content, inputOptions, params) => {
    const radio = getChildByClass(content, swalClasses.radio)
    inputOptions.forEach(inputOption => {
      const radioValue = inputOption[0]
      const radioLabel = inputOption[1]
      const radioInput = document.createElement('input')
      const radioLabelElement = document.createElement('label')
      radioInput.type = 'radio'
      radioInput.name = swalClasses.radio
      radioInput.value = radioValue
      if (params.inputValue.toString() === radioValue.toString()) {
        radioInput.checked = true
      }
      const label = document.createElement('span')
      label.innerHTML = radioLabel
      label.className = swalClasses.label
      radioLabelElement.appendChild(radioInput)
      radioLabelElement.appendChild(label)
      radio.appendChild(radioLabelElement)
    })
    const radios = radio.querySelectorAll('input')
    if (radios.length) {
      radios[0].focus()
    }
  }
}

/**
 * Converts `inputOptions` into an array of `[value, label]`s
 * @param inputOptions
 */
const formatInputOptions = (inputOptions) => {
  const result = []
  if (typeof Map !== 'undefined' && inputOptions instanceof Map) {
    inputOptions.forEach((value, key) => {
      result.push([key, value])
    })
  } else {
    Object.keys(inputOptions).forEach(key => {
      result.push([key, inputOptions[key]])
    })
  }
  return result
}
