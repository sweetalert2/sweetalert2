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

  if (params.input) {
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
