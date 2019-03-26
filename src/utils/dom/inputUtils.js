import { swalClasses } from '../classes.js'
import { getChildByClass } from './domUtils'

export const populateInputOptions = {
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
