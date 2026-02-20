/// <reference path="../../../../sweetalert2.d.ts"/>

/**
 * @typedef { HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement } Input
 * @typedef { 'input' | 'file' | 'range' | 'select' | 'radio' | 'checkbox' | 'textarea' } InputClass
 */
import privateProps from '../../../privateProps.js'
import { swalClasses } from '../../classes.js'
import * as dom from '../../dom/index.js'
import { error, isPromise, warn } from '../../utils.js'

/** @type {InputClass[]} */
const inputClasses = ['input', 'file', 'range', 'select', 'radio', 'checkbox', 'textarea']

/**
 * @param {SweetAlert} instance
 * @param {SweetAlertOptions} params
 */
export const renderInput = (instance, params) => {
  const popup = dom.getPopup()
  if (!popup) {
    return
  }
  const innerParams = privateProps.innerParams.get(instance)
  const rerender = !innerParams || params.input !== innerParams.input

  inputClasses.forEach((inputClass) => {
    const inputContainer = dom.getDirectChildByClass(popup, swalClasses[inputClass])

    if (!inputContainer) {
      return
    }

    // set attributes
    setAttributes(inputClass, params.inputAttributes)

    // set class
    inputContainer.className = swalClasses[inputClass]

    if (rerender) {
      dom.hide(inputContainer)
    }
  })

  // Hide multiple-inputs container by default
  const multipleInputsContainer = dom.getDirectChildByClass(popup, swalClasses['multiple-inputs'])
  if (multipleInputsContainer) {
    dom.hide(multipleInputsContainer)
  }

  if (params.multipleInputs) {
    renderMultipleInputs(params)
  } else if (params.input) {
    if (rerender) {
      showInput(params)
    }
    // set custom class
    setCustomClass(params)
  }
}

/**
 * @param {SweetAlertOptions} params
 */
const showInput = (params) => {
  if (!params.input) {
    return
  }

  if (!renderInputType[params.input]) {
    error(`Unexpected type of input! Expected ${Object.keys(renderInputType).join(' | ')}, got "${params.input}"`)
    return
  }

  const inputContainer = getInputContainer(params.input)
  if (!inputContainer) {
    return
  }

  const input = renderInputType[params.input](inputContainer, params)
  dom.show(inputContainer)

  // input autofocus
  if (params.inputAutoFocus) {
    setTimeout(() => {
      dom.focusInput(input)
    })
  }
}

/**
 * @param {HTMLInputElement} input
 */
const removeAttributes = (input) => {
  for (let i = 0; i < input.attributes.length; i++) {
    const attrName = input.attributes[i].name
    if (!['id', 'type', 'value', 'style'].includes(attrName)) {
      input.removeAttribute(attrName)
    }
  }
}

/**
 * @param {InputClass} inputClass
 * @param {SweetAlertOptions['inputAttributes']} inputAttributes
 */
const setAttributes = (inputClass, inputAttributes) => {
  const popup = dom.getPopup()
  if (!popup) {
    return
  }

  const input = dom.getInput(popup, inputClass)
  if (!input) {
    return
  }

  removeAttributes(input)

  for (const attr in inputAttributes) {
    input.setAttribute(attr, inputAttributes[attr])
  }
}

/**
 * @param {SweetAlertOptions} params
 */
const setCustomClass = (params) => {
  if (!params.input) {
    return
  }
  const inputContainer = getInputContainer(params.input)
  if (inputContainer) {
    dom.applyCustomClass(inputContainer, params, 'input')
  }
}

/**
 * @param {HTMLInputElement | HTMLTextAreaElement} input
 * @param {SweetAlertOptions} params
 */
const setInputPlaceholder = (input, params) => {
  if (!input.placeholder && params.inputPlaceholder) {
    input.placeholder = params.inputPlaceholder
  }
}

/**
 * @param {Input} input
 * @param {Input} prependTo
 * @param {SweetAlertOptions} params
 */
const setInputLabel = (input, prependTo, params) => {
  if (params.inputLabel) {
    const label = document.createElement('label')
    const labelClass = swalClasses['input-label']
    label.setAttribute('for', input.id)
    label.className = labelClass
    if (typeof params.customClass === 'object') {
      dom.addClass(label, params.customClass.inputLabel)
    }
    label.innerText = params.inputLabel
    prependTo.insertAdjacentElement('beforebegin', label)
  }
}

/**
 * @param {SweetAlertInput} inputType
 * @returns {HTMLElement | undefined}
 */
const getInputContainer = (inputType) => {
  const popup = dom.getPopup()
  if (!popup) {
    return
  }

  return dom.getDirectChildByClass(popup, swalClasses[/** @type {SwalClass} */ (inputType)] || swalClasses.input)
}

/**
 * @param {HTMLInputElement | HTMLOutputElement | HTMLTextAreaElement} input
 * @param {SweetAlertOptions['inputValue']} inputValue
 */
const checkAndSetInputValue = (input, inputValue) => {
  if (['string', 'number'].includes(typeof inputValue)) {
    input.value = `${inputValue}`
  } else if (!isPromise(inputValue)) {
    warn(`Unexpected type of inputValue! Expected "string", "number" or "Promise", got "${typeof inputValue}"`)
  }
}

/** @type {Record<SweetAlertInput, (input: Input | HTMLElement, params: SweetAlertOptions) => Input>} */
const renderInputType = {}

/**
 * @param {Input | HTMLElement} input
 * @param {SweetAlertOptions} params
 * @returns {Input}
 */
renderInputType.text =
  renderInputType.email =
  renderInputType.password =
  renderInputType.number =
  renderInputType.tel =
  renderInputType.url =
  renderInputType.search =
  renderInputType.date =
  renderInputType['datetime-local'] =
  renderInputType.time =
  renderInputType.week =
  renderInputType.month =
    /** @type {(input: Input | HTMLElement, params: SweetAlertOptions) => Input} */
    (input, params) => {
      const inputElement = /** @type {HTMLInputElement} */ (input)
      checkAndSetInputValue(inputElement, params.inputValue)
      setInputLabel(inputElement, inputElement, params)
      setInputPlaceholder(inputElement, params)
      inputElement.type = /** @type {string} */ (params.input)
      return inputElement
    }

/**
 * @param {Input | HTMLElement} input
 * @param {SweetAlertOptions} params
 * @returns {Input}
 */
renderInputType.file = (input, params) => {
  const inputElement = /** @type {HTMLInputElement} */ (input)
  setInputLabel(inputElement, inputElement, params)
  setInputPlaceholder(inputElement, params)
  return inputElement
}

/**
 * @param {Input | HTMLElement} range
 * @param {SweetAlertOptions} params
 * @returns {Input}
 */
renderInputType.range = (range, params) => {
  const rangeContainer = /** @type {HTMLElement} */ (range)
  const rangeInput = rangeContainer.querySelector('input')
  const rangeOutput = rangeContainer.querySelector('output')
  if (rangeInput) {
    checkAndSetInputValue(rangeInput, params.inputValue)
    rangeInput.type = /** @type {string} */ (params.input)
    setInputLabel(rangeInput, /** @type {Input} */ (range), params)
  }
  if (rangeOutput) {
    checkAndSetInputValue(rangeOutput, params.inputValue)
  }
  return /** @type {Input} */ (range)
}

/**
 * @param {Input | HTMLElement} select
 * @param {SweetAlertOptions} params
 * @returns {Input}
 */
renderInputType.select = (select, params) => {
  const selectElement = /** @type {HTMLSelectElement} */ (select)
  selectElement.textContent = ''
  if (params.inputPlaceholder) {
    const placeholder = document.createElement('option')
    dom.setInnerHtml(placeholder, params.inputPlaceholder)
    placeholder.value = ''
    placeholder.disabled = true
    placeholder.selected = true
    selectElement.appendChild(placeholder)
  }
  setInputLabel(selectElement, selectElement, params)
  return selectElement
}

/**
 * @param {Input | HTMLElement} radio
 * @returns {Input}
 */
renderInputType.radio = (radio) => {
  const radioElement = /** @type {HTMLElement} */ (radio)
  radioElement.textContent = ''
  return /** @type {Input} */ (radio)
}

/**
 * @param {Input | HTMLElement} checkboxContainer
 * @param {SweetAlertOptions} params
 * @returns {Input}
 */
renderInputType.checkbox = (checkboxContainer, params) => {
  const popup = dom.getPopup()
  if (!popup) {
    throw new Error('Popup not found')
  }
  const checkbox = dom.getInput(popup, 'checkbox')
  if (!checkbox) {
    throw new Error('Checkbox input not found')
  }
  checkbox.value = '1'
  checkbox.checked = Boolean(params.inputValue)
  const containerElement = /** @type {HTMLElement} */ (checkboxContainer)
  const label = containerElement.querySelector('span')
  if (label) {
    const placeholderOrLabel = params.inputPlaceholder || params.inputLabel
    if (placeholderOrLabel) {
      dom.setInnerHtml(label, placeholderOrLabel)
    }
  }
  return checkbox
}

/**
 * @param {Input | HTMLElement} textarea
 * @param {SweetAlertOptions} params
 * @returns {Input}
 */
renderInputType.textarea = (textarea, params) => {
  const textareaElement = /** @type {HTMLTextAreaElement} */ (textarea)
  checkAndSetInputValue(textareaElement, params.inputValue)
  setInputPlaceholder(textareaElement, params)
  setInputLabel(textareaElement, textareaElement, params)

  /**
   * @param {HTMLElement} el
   * @returns {number}
   */
  const getMargin = (el) =>
    parseInt(window.getComputedStyle(el).marginLeft) + parseInt(window.getComputedStyle(el).marginRight)

  // https://github.com/sweetalert2/sweetalert2/issues/2291
  setTimeout(() => {
    // https://github.com/sweetalert2/sweetalert2/issues/1699
    if ('MutationObserver' in window) {
      const popup = dom.getPopup()
      if (!popup) {
        return
      }
      const initialPopupWidth = parseInt(window.getComputedStyle(popup).width)
      const textareaResizeHandler = () => {
        // check if texarea is still in document (i.e. popup wasn't closed in the meantime)
        if (!document.body.contains(textareaElement)) {
          return
        }
        const textareaWidth = textareaElement.offsetWidth + getMargin(textareaElement)
        const popupElement = dom.getPopup()
        if (popupElement) {
          if (textareaWidth > initialPopupWidth) {
            popupElement.style.width = `${textareaWidth}px`
          } else {
            dom.applyNumericalStyle(popupElement, 'width', params.width)
          }
        }
      }
      new MutationObserver(textareaResizeHandler).observe(textareaElement, {
        attributes: true,
        attributeFilter: ['style'],
      })
    }
  })

  return textareaElement
}

/**
 * @param {SweetAlertOptions} params
 */
const renderMultipleInputs = (params) => {
  const popup = dom.getPopup()
  if (!popup || !params.multipleInputs) {
    return
  }

  const container = dom.getDirectChildByClass(popup, swalClasses['multiple-inputs'])
  if (!container) {
    return
  }

  container.textContent = ''

  for (const [key, config] of Object.entries(params.multipleInputs)) {
    const inputType = config.input || 'text'
    const inputElement = createMultipleInput(key, inputType, config)
    if (inputElement) {
      container.appendChild(inputElement)
    }
  }

  dom.show(container)

  // Focus first input if inputAutoFocus is enabled
  if (params.inputAutoFocus) {
    const firstInput = container.querySelector('input, textarea, select')
    if (firstInput) {
      setTimeout(() => {
        dom.focusInput(/** @type {HTMLInputElement} */ (firstInput))
      })
    }
  }
}

/**
 * @param {string} key
 * @param {string} inputType
 * @param {object} config
 * @returns {HTMLElement | null}
 */
const createMultipleInput = (key, inputType, config) => {
  /** @type {HTMLElement | null} */
  let inputElement = null

  switch (inputType) {
    case 'textarea': {
      inputElement = document.createElement('textarea')
      inputElement.className = swalClasses.textarea
      inputElement.setAttribute('data-swal-multiple-input-key', key)
      if (config.inputPlaceholder) {
        inputElement.placeholder = config.inputPlaceholder
      }
      if (config.inputValue !== undefined && config.inputValue !== null) {
        inputElement.value = `${config.inputValue}`
      }
      break
    }
    case 'select': {
      inputElement = document.createElement('select')
      inputElement.className = swalClasses.select
      inputElement.setAttribute('data-swal-multiple-input-key', key)
      if (config.inputPlaceholder) {
        const placeholder = document.createElement('option')
        dom.setInnerHtml(placeholder, config.inputPlaceholder)
        placeholder.value = ''
        placeholder.disabled = true
        placeholder.selected = true
        inputElement.appendChild(placeholder)
      }
      if (config.inputOptions) {
        populateMultipleInputSelectOptions(inputElement, config.inputOptions, config.inputValue)
      }
      break
    }
    case 'checkbox': {
      const label = document.createElement('label')
      label.className = swalClasses.checkbox
      const checkbox = document.createElement('input')
      checkbox.type = 'checkbox'
      checkbox.value = '1'
      checkbox.checked = Boolean(config.inputValue)
      checkbox.setAttribute('data-swal-multiple-input-key', key)
      label.appendChild(checkbox)
      const span = document.createElement('span')
      span.className = swalClasses.label
      if (config.inputPlaceholder || config.inputLabel) {
        dom.setInnerHtml(span, config.inputPlaceholder || config.inputLabel)
      }
      label.appendChild(span)
      inputElement = label
      break
    }
    case 'radio': {
      const radioContainer = document.createElement('div')
      radioContainer.className = swalClasses.radio
      radioContainer.setAttribute('data-swal-multiple-input-key', key)
      if (config.inputOptions) {
        populateMultipleInputRadioOptions(radioContainer, config.inputOptions, config.inputValue)
      }
      inputElement = radioContainer
      break
    }
    case 'file': {
      inputElement = document.createElement('input')
      inputElement.type = 'file'
      inputElement.className = swalClasses.file
      inputElement.setAttribute('data-swal-multiple-input-key', key)
      break
    }
    case 'range': {
      const rangeContainer = document.createElement('div')
      rangeContainer.className = swalClasses.range
      const rangeInput = document.createElement('input')
      rangeInput.type = 'range'
      rangeInput.setAttribute('data-swal-multiple-input-key', key)
      const rangeOutput = document.createElement('output')
      if (config.inputValue !== undefined && config.inputValue !== null) {
        rangeInput.value = `${config.inputValue}`
        rangeOutput.value = `${config.inputValue}`
      }
      rangeContainer.appendChild(rangeInput)
      rangeContainer.appendChild(rangeOutput)
      rangeInput.oninput = () => {
        rangeOutput.value = rangeInput.value
      }
      rangeInput.onchange = () => {
        rangeOutput.value = rangeInput.value
      }
      inputElement = rangeContainer
      break
    }
    default: {
      // text, email, password, number, tel, url, search, date, datetime-local, time, week, month
      inputElement = document.createElement('input')
      inputElement.type = inputType
      inputElement.className = swalClasses.input
      inputElement.setAttribute('data-swal-multiple-input-key', key)
      if (config.inputPlaceholder) {
        inputElement.placeholder = config.inputPlaceholder
      }
      if (config.inputValue !== undefined && config.inputValue !== null) {
        inputElement.value = `${config.inputValue}`
      }
      break
    }
  }

  if (inputElement) {
    // Set input attributes
    if (config.inputAttributes) {
      const target = inputElement.querySelector('input') || inputElement
      for (const attr in config.inputAttributes) {
        target.setAttribute(attr, config.inputAttributes[attr])
      }
    }

    // Add label before the input
    if (config.inputLabel) {
      const label = document.createElement('label')
      label.className = swalClasses['input-label']
      label.innerText = config.inputLabel
      inputElement.insertAdjacentElement('beforebegin', label)
      // Since insertAdjacentElement requires a parent, we wrap in a fragment approach
      // Instead, we'll create a wrapper
      const wrapper = document.createDocumentFragment()
      wrapper.appendChild(label)
      wrapper.appendChild(inputElement)
      // Return the fragment by wrapping in a div
      const wrapperDiv = document.createElement('div')
      wrapperDiv.appendChild(label)
      wrapperDiv.appendChild(inputElement)
      return wrapperDiv
    }
  }

  return inputElement
}

/**
 * @param {HTMLSelectElement} select
 * @param {Record<string, any> | Map<string, any>} inputOptions
 * @param {*} inputValue
 */
const populateMultipleInputSelectOptions = (select, inputOptions, inputValue) => {
  const options = formatMultipleInputOptions(inputOptions)
  options.forEach((option) => {
    const optionElement = document.createElement('option')
    optionElement.value = option[0]
    dom.setInnerHtml(optionElement, option[1])
    if (inputValue !== undefined && inputValue !== null && inputValue.toString() === option[0].toString()) {
      optionElement.selected = true
    }
    select.appendChild(optionElement)
  })
}

/**
 * @param {HTMLElement} radioContainer
 * @param {Record<string, any> | Map<string, any>} inputOptions
 * @param {*} inputValue
 */
const populateMultipleInputRadioOptions = (radioContainer, inputOptions, inputValue) => {
  const options = formatMultipleInputOptions(inputOptions)
  options.forEach((option) => {
    const radioInput = document.createElement('input')
    const radioLabelElement = document.createElement('label')
    radioInput.type = 'radio'
    radioInput.name = `swal2-radio-${radioContainer.getAttribute('data-swal-multiple-input-key')}`
    radioInput.value = option[0]
    if (inputValue !== undefined && inputValue !== null && inputValue.toString() === option[0].toString()) {
      radioInput.checked = true
    }
    const label = document.createElement('span')
    dom.setInnerHtml(label, option[1])
    label.className = swalClasses.label
    radioLabelElement.appendChild(radioInput)
    radioLabelElement.appendChild(label)
    radioContainer.appendChild(radioLabelElement)
  })
}

/**
 * @param {Record<string, any> | Map<string, any>} inputOptions
 * @returns {Array<[string, string]>}
 */
const formatMultipleInputOptions = (inputOptions) => {
  /** @type {Array<[string, string]>} */
  const result = []
  if (inputOptions instanceof Map) {
    inputOptions.forEach((value, key) => {
      result.push([key, value])
    })
  } else {
    Object.keys(inputOptions).forEach((key) => {
      result.push([key, inputOptions[key]])
    })
  }
  return result
}
