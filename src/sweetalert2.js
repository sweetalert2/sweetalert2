import {showWarningsForParams} from './utils/params.js'
import { swalClasses } from './utils/classes.js'
import { formatInputOptions, error, callIfFunction } from './utils/utils.js'
import * as dom from './utils/dom/index'
import setParameters from './utils/setParameters.js'
import { DismissReason } from './utils/DismissReason'
import {fixScrollbar} from './utils/scrollbarFix'
import {iOSfix} from './utils/iosFix'
import {version} from '../package.json'
import * as staticMethods from './staticMethods'
import globalState from './globalState'

let currentContext

/**
 * Animations
 *
 * @param animation
 * @param onBeforeOpen
 * @param onComplete
 */
const openPopup = (animation, onBeforeOpen, onOpen) => {
  const container = dom.getContainer()
  const popup = dom.getPopup()

  if (onBeforeOpen !== null && typeof onBeforeOpen === 'function') {
    onBeforeOpen(popup)
  }

  if (animation) {
    dom.addClass(popup, swalClasses.show)
    dom.addClass(container, swalClasses.fade)
    dom.removeClass(popup, swalClasses.hide)
  } else {
    dom.removeClass(popup, swalClasses.fade)
  }
  dom.show(popup)

  // scrolling is 'hidden' until animation is done, after that 'auto'
  container.style.overflowY = 'hidden'
  if (dom.animationEndEvent && !dom.hasClass(popup, swalClasses.noanimation)) {
    popup.addEventListener(dom.animationEndEvent, function swalCloseEventFinished () {
      popup.removeEventListener(dom.animationEndEvent, swalCloseEventFinished)
      container.style.overflowY = 'auto'
    })
  } else {
    container.style.overflowY = 'auto'
  }

  dom.addClass([document.documentElement, document.body, container], swalClasses.shown)
  if (dom.isModal()) {
    fixScrollbar()
    iOSfix()
  }
  dom.states.previousActiveElement = document.activeElement
  if (onOpen !== null && typeof onOpen === 'function') {
    setTimeout(() => {
      onOpen(popup)
    })
  }
}

// SweetAlert entry point
const sweetAlert = (...args) => {
  // Prevent run in Node env
  if (typeof window === 'undefined') {
    return
  }

  // Check for the existence of Promise
  if (typeof Promise === 'undefined') {
    error('This package requires a Promise library, please include a shim to enable it in this browser (See: https://github.com/sweetalert2/sweetalert2/wiki/Migration-from-SweetAlert-to-SweetAlert2#1-ie-support)')
  }

  if (typeof args[0] === 'undefined') {
    error('SweetAlert2 expects at least 1 attribute!')
    return false
  }

  const context = currentContext = {}

  const userParams = sweetAlert.argsToParams(args)
  showWarningsForParams(userParams)
  const params = context.params = Object.assign({}, globalState.popupParams, userParams)
  setParameters(params)

  const domCache = context.domCache = {
    popup: dom.getPopup(),
    container: dom.getContainer(),
    content: dom.getContent(),
    actions: dom.getActions(),
    confirmButton: dom.getConfirmButton(),
    cancelButton: dom.getCancelButton(),
    closeButton: dom.getCloseButton(),
    validationError: dom.getValidationError(),
    progressSteps: dom.getProgressSteps()
  }

  return new Promise((resolve, reject) => {
    // functions to handle all resolving/rejecting/settling
    const succeedWith = (value) => {
      sweetAlert.closePopup(params.onClose, params.onAfterClose)
      if (params.useRejections) {
        resolve(value)
      } else {
        resolve({value})
      }
    }
    const dismissWith = (dismiss) => {
      sweetAlert.closePopup(params.onClose, params.onAfterClose)
      if (params.useRejections) {
        reject(dismiss)
      } else {
        resolve({dismiss})
      }
    }
    const errorWith = (error) => {
      sweetAlert.closePopup(params.onClose, params.onAfterClose)
      reject(error)
    }

    // Close on timer
    if (params.timer) {
      domCache.popup.timeout = setTimeout(() => dismissWith('timer'), params.timer)
    }

    // Get the value of the popup input
    const getInputValue = () => {
      const input = sweetAlert.getInput()
      if (!input) {
        return null
      }
      switch (params.input) {
        case 'checkbox':
          return input.checked ? 1 : 0
        case 'radio':
          return input.checked ? input.value : null
        case 'file':
          return input.files.length ? input.files[0] : null
        default:
          return params.inputAutoTrim ? input.value.trim() : input.value
      }
    }

    // input autofocus
    if (params.input) {
      setTimeout(() => {
        const input = sweetAlert.getInput()
        if (input) {
          dom.focusInput(input)
        }
      }, 0)
    }

    const confirm = (value) => {
      if (params.showLoaderOnConfirm) {
        sweetAlert.showLoading()
      }

      if (params.preConfirm) {
        sweetAlert.resetValidationError()
        const preConfirmPromise = Promise.resolve().then(() => params.preConfirm(value, params.extraParams))
        if (params.expectRejections) {
          preConfirmPromise.then(
            (preConfirmValue) => succeedWith(preConfirmValue || value),
            (validationError) => {
              sweetAlert.hideLoading()
              if (validationError) {
                sweetAlert.showValidationError(validationError)
              }
            }
          )
        } else {
          preConfirmPromise.then(
            (preConfirmValue) => {
              if (dom.isVisible(domCache.validationError) || preConfirmValue === false) {
                sweetAlert.hideLoading()
              } else {
                succeedWith(preConfirmValue || value)
              }
            },
            (error) => errorWith(error)
          )
        }
      } else {
        succeedWith(value)
      }
    }

    // Mouse interactions
    const onButtonEvent = (event) => {
      const e = event || window.event
      const target = e.target || e.srcElement
      const {confirmButton, cancelButton} = domCache
      const targetedConfirm = confirmButton && (confirmButton === target || confirmButton.contains(target))
      const targetedCancel = cancelButton && (cancelButton === target || cancelButton.contains(target))

      switch (e.type) {
        case 'click':
          // Clicked 'confirm'
          if (targetedConfirm && sweetAlert.isVisible()) {
            sweetAlert.disableButtons()
            if (params.input) {
              const inputValue = getInputValue()

              if (params.inputValidator) {
                sweetAlert.disableInput()
                const validationPromise = Promise.resolve().then(() => params.inputValidator(inputValue, params.extraParams))
                if (params.expectRejections) {
                  validationPromise.then(
                    () => {
                      sweetAlert.enableButtons()
                      sweetAlert.enableInput()
                      confirm(inputValue)
                    },
                    (validationError) => {
                      sweetAlert.enableButtons()
                      sweetAlert.enableInput()
                      if (validationError) {
                        sweetAlert.showValidationError(validationError)
                      }
                    }
                  )
                } else {
                  validationPromise.then(
                    (validationError) => {
                      sweetAlert.enableButtons()
                      sweetAlert.enableInput()
                      if (validationError) {
                        sweetAlert.showValidationError(validationError)
                      } else {
                        confirm(inputValue)
                      }
                    },
                    error => errorWith(error)
                  )
                }
              } else {
                confirm(inputValue)
              }
            } else {
              confirm(true)
            }

          // Clicked 'cancel'
          } else if (targetedCancel && sweetAlert.isVisible()) {
            sweetAlert.disableButtons()
            dismissWith(sweetAlert.DismissReason.cancel)
          }
          break
        default:
      }
    }

    const buttons = domCache.popup.querySelectorAll('button')
    for (let i = 0; i < buttons.length; i++) {
      buttons[i].onclick = onButtonEvent
      buttons[i].onmouseover = onButtonEvent
      buttons[i].onmouseout = onButtonEvent
      buttons[i].onmousedown = onButtonEvent
    }

    // Closing popup by close button
    domCache.closeButton.onclick = () => {
      dismissWith(sweetAlert.DismissReason.close)
    }

    if (params.toast) {
      // Closing popup by internal click
      domCache.popup.onclick = (e) => {
        if (
          params.showConfirmButton ||
          params.showCancelButton ||
          params.showCloseButton ||
          params.input
        ) {
          return
        }
        sweetAlert.closePopup(params.onClose, params.onAfterClose)
        dismissWith(sweetAlert.DismissReason.close)
      }
    } else {
      let ignoreOutsideClick = false

      // Ignore click events that had mousedown on the popup but mouseup on the container
      // This can happen when the user drags a slider
      domCache.popup.onmousedown = () => {
        domCache.container.onmouseup = function (e) {
          domCache.container.onmouseup = undefined
          // We only check if the mouseup target is the container because usually it doesn't
          // have any other direct children aside of the popup
          if (e.target === domCache.container) {
            ignoreOutsideClick = true
          }
        }
      }

      // Ignore click events that had mousedown on the container but mouseup on the popup
      domCache.container.onmousedown = () => {
        domCache.popup.onmouseup = function (e) {
          domCache.popup.onmouseup = undefined
          // We also need to check if the mouseup target is a child of the popup
          if (e.target === domCache.popup || domCache.popup.contains(e.target)) {
            ignoreOutsideClick = true
          }
        }
      }

      domCache.container.onclick = (e) => {
        if (ignoreOutsideClick) {
          ignoreOutsideClick = false
          return
        }
        if (e.target !== domCache.container) {
          return
        }
        if (callIfFunction(params.allowOutsideClick)) {
          dismissWith(sweetAlert.DismissReason.backdrop)
        }
      }
    }

    // Reverse buttons (Confirm on the right side)
    if (params.reverseButtons) {
      domCache.confirmButton.parentNode.insertBefore(domCache.cancelButton, domCache.confirmButton)
    } else {
      domCache.confirmButton.parentNode.insertBefore(domCache.confirmButton, domCache.cancelButton)
    }

    // Focus handling
    const setFocus = (index, increment) => {
      const focusableElements = dom.getFocusableElements(params.focusCancel)
      // search for visible elements and select the next possible match
      for (let i = 0; i < focusableElements.length; i++) {
        index = index + increment

        // rollover to first item
        if (index === focusableElements.length) {
          index = 0

        // go to last item
        } else if (index === -1) {
          index = focusableElements.length - 1
        }

        // determine if element is visible
        const el = focusableElements[index]
        if (dom.isVisible(el)) {
          return el.focus()
        }
      }
    }

    const handleKeyDown = (event) => {
      const e = event || window.event

      const arrowKeys = [
        'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
        'Left', 'Right', 'Up', 'Down' // IE11
      ]

      if (e.key === 'Enter' && !e.isComposing) {
        if (e.target === sweetAlert.getInput()) {
          if (['textarea', 'file'].includes(params.input)) {
            return // do not submit
          }

          sweetAlert.clickConfirm()
          e.preventDefault()
        }

      // TAB
      } else if (e.key === 'Tab') {
        const targetElement = e.target || e.srcElement

        const focusableElements = dom.getFocusableElements(params.focusCancel)
        let btnIndex = -1 // Find the button - note, this is a nodelist, not an array.
        for (let i = 0; i < focusableElements.length; i++) {
          if (targetElement === focusableElements[i]) {
            btnIndex = i
            break
          }
        }

        if (!e.shiftKey) {
          // Cycle to the next button
          setFocus(btnIndex, 1)
        } else {
          // Cycle to the prev button
          setFocus(btnIndex, -1)
        }
        e.stopPropagation()
        e.preventDefault()

      // ARROWS - switch focus between buttons
      } else if (arrowKeys.includes(e.key)) {
        // focus Cancel button if Confirm button is currently focused
        if (document.activeElement === domCache.confirmButton && dom.isVisible(domCache.cancelButton)) {
          domCache.cancelButton.focus()
        // and vice versa
        } else if (document.activeElement === domCache.cancelButton && dom.isVisible(domCache.confirmButton)) {
          domCache.confirmButton.focus()
        }

      // ESC
      } else if ((e.key === 'Escape' || e.key === 'Esc') && callIfFunction(params.allowEscapeKey) === true) {
        dismissWith(sweetAlert.DismissReason.esc)
      }
    }

    if (params.toast && globalState.windowOnkeydownOverridden) {
      window.onkeydown = globalState.previousWindowKeyDown
      globalState.windowOnkeydownOverridden = false
    }

    if (!params.toast && !globalState.windowOnkeydownOverridden) {
      globalState.previousWindowKeyDown = window.onkeydown
      globalState.windowOnkeydownOverridden = true
      window.onkeydown = handleKeyDown
    }

    sweetAlert.enableButtons()
    sweetAlert.hideLoading()
    sweetAlert.resetValidationError()

    if (params.input) {
      dom.addClass(document.body, swalClasses['has-input'])
    }

    // inputs
    const inputTypes = ['input', 'file', 'range', 'select', 'radio', 'checkbox', 'textarea']
    let input
    for (let i = 0; i < inputTypes.length; i++) {
      const inputClass = swalClasses[inputTypes[i]]
      const inputContainer = dom.getChildByClass(domCache.content, inputClass)
      input = sweetAlert.getInput(inputTypes[i])

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
          input.setAttribute(attr, params.inputAttributes[attr])
        }
      }

      // set class
      inputContainer.className = inputClass
      if (params.inputClass) {
        dom.addClass(inputContainer, params.inputClass)
      }

      dom.hide(inputContainer)
    }

    let populateInputOptions
    switch (params.input) {
      case 'text':
      case 'email':
      case 'password':
      case 'number':
      case 'tel':
      case 'url':
        input = dom.getChildByClass(domCache.content, swalClasses.input)
        input.value = params.inputValue
        input.placeholder = params.inputPlaceholder
        input.type = params.input
        dom.show(input)
        break
      case 'file':
        input = dom.getChildByClass(domCache.content, swalClasses.file)
        input.placeholder = params.inputPlaceholder
        input.type = params.input
        dom.show(input)
        break
      case 'range':
        const range = dom.getChildByClass(domCache.content, swalClasses.range)
        const rangeInput = range.querySelector('input')
        const rangeOutput = range.querySelector('output')
        rangeInput.value = params.inputValue
        rangeInput.type = params.input
        rangeOutput.value = params.inputValue
        dom.show(range)
        break
      case 'select':
        const select = dom.getChildByClass(domCache.content, swalClasses.select)
        select.innerHTML = ''
        if (params.inputPlaceholder) {
          const placeholder = document.createElement('option')
          placeholder.innerHTML = params.inputPlaceholder
          placeholder.value = ''
          placeholder.disabled = true
          placeholder.selected = true
          select.appendChild(placeholder)
        }
        populateInputOptions = (inputOptions) => {
          inputOptions.forEach(([optionValue, optionLabel]) => {
            const option = document.createElement('option')
            option.value = optionValue
            option.innerHTML = optionLabel
            if (params.inputValue.toString() === optionValue.toString()) {
              option.selected = true
            }
            select.appendChild(option)
          })
          dom.show(select)
          select.focus()
        }
        break
      case 'radio':
        const radio = dom.getChildByClass(domCache.content, swalClasses.radio)
        radio.innerHTML = ''
        populateInputOptions = (inputOptions) => {
          inputOptions.forEach(([radioValue, radioLabel]) => {
            const radioInput = document.createElement('input')
            const radioLabelElement = document.createElement('label')
            radioInput.type = 'radio'
            radioInput.name = swalClasses.radio
            radioInput.value = radioValue
            if (params.inputValue.toString() === radioValue.toString()) {
              radioInput.checked = true
            }
            radioLabelElement.innerHTML = radioLabel
            radioLabelElement.insertBefore(radioInput, radioLabelElement.firstChild)
            radio.appendChild(radioLabelElement)
          })
          dom.show(radio)
          const radios = radio.querySelectorAll('input')
          if (radios.length) {
            radios[0].focus()
          }
        }
        break
      case 'checkbox':
        const checkbox = dom.getChildByClass(domCache.content, swalClasses.checkbox)
        const checkboxInput = sweetAlert.getInput('checkbox')
        checkboxInput.type = 'checkbox'
        checkboxInput.value = 1
        checkboxInput.id = swalClasses.checkbox
        checkboxInput.checked = Boolean(params.inputValue)
        let label = checkbox.getElementsByTagName('span')
        if (label.length) {
          checkbox.removeChild(label[0])
        }
        label = document.createElement('span')
        label.innerHTML = params.inputPlaceholder
        checkbox.appendChild(label)
        dom.show(checkbox)
        break
      case 'textarea':
        const textarea = dom.getChildByClass(domCache.content, swalClasses.textarea)
        textarea.value = params.inputValue
        textarea.placeholder = params.inputPlaceholder
        dom.show(textarea)
        break
      case null:
        break
      default:
        error(`Unexpected type of input! Expected "text", "email", "password", "number", "tel", "select", "radio", "checkbox", "textarea", "file" or "url", got "${params.input}"`)
        break
    }

    if (params.input === 'select' || params.input === 'radio') {
      const processInputOptions = inputOptions => populateInputOptions(formatInputOptions(inputOptions))
      if (params.inputOptions instanceof Promise) {
        sweetAlert.showLoading()
        params.inputOptions.then((inputOptions) => {
          sweetAlert.hideLoading()
          processInputOptions(inputOptions)
        })
      } else if (typeof params.inputOptions === 'object') {
        processInputOptions(params.inputOptions)
      } else {
        error('Unexpected type of inputOptions! Expected object, Map or Promise, got ' + typeof params.inputOptions)
      }
    } else if (['text', 'email', 'number', 'tel', 'textarea'].includes(params.input) && params.inputValue instanceof Promise) {
      sweetAlert.showLoading()
      dom.hide(input)
      params.inputValue.then((inputValue) => {
        input.value = params.input === 'number' ? parseFloat(inputValue) || 0 : inputValue + ''
        dom.show(input)
        sweetAlert.hideLoading()
      })
      .catch((err) => {
        error('Error in inputValue promise: ' + err)
        input.value = ''
        dom.show(input)
        sweetAlert.hideLoading()
      })
    }

    openPopup(params.animation, params.onBeforeOpen, params.onOpen)

    if (!params.toast) {
      if (!callIfFunction(params.allowEnterKey)) {
        if (document.activeElement) {
          document.activeElement.blur()
        }
      } else if (params.focusCancel && dom.isVisible(domCache.cancelButton)) {
        domCache.cancelButton.focus()
      } else if (params.focusConfirm && dom.isVisible(domCache.confirmButton)) {
        domCache.confirmButton.focus()
      } else {
        setFocus(-1, 1)
      }
    }

    // fix scroll
    domCache.container.scrollTop = 0
  })
}

// Assign static methods from src/staticMethods/*.js
Object.assign(sweetAlert, staticMethods)

/**
 * Show spinner instead of Confirm button and disable Cancel button
 */
sweetAlert.hideLoading = sweetAlert.disableLoading = () => {
  if (currentContext) {
    const {params, domCache} = currentContext
    if (!params.showConfirmButton) {
      dom.hide(domCache.confirmButton)
      if (!params.showCancelButton) {
        dom.hide(domCache.actions)
      }
    }
    dom.removeClass([domCache.popup, domCache.actions], swalClasses.loading)
    domCache.popup.removeAttribute('aria-busy')
    domCache.popup.removeAttribute('data-loading')
    domCache.confirmButton.disabled = false
    domCache.cancelButton.disabled = false
  }
}

// Get input element by specified type or, if type isn't specified, by params.input
sweetAlert.getInput = (inputType) => {
  if (currentContext) {
    const {params, domCache} = currentContext
    inputType = inputType || params.input
    if (!inputType) {
      return null
    }
    switch (inputType) {
      case 'select':
      case 'textarea':
      case 'file':
        return dom.getChildByClass(domCache.content, swalClasses[inputType])
      case 'checkbox':
        return domCache.popup.querySelector(`.${swalClasses.checkbox} input`)
      case 'radio':
        return domCache.popup.querySelector(`.${swalClasses.radio} input:checked`) ||
          domCache.popup.querySelector(`.${swalClasses.radio} input:first-child`)
      case 'range':
        return domCache.popup.querySelector(`.${swalClasses.range} input`)
      default:
        return dom.getChildByClass(domCache.content, swalClasses.input)
    }
  }
}

sweetAlert.enableButtons = () => {
  if (currentContext) {
    const {domCache} = currentContext
    domCache.confirmButton.disabled = false
    domCache.cancelButton.disabled = false
  }
}

sweetAlert.disableButtons = () => {
  if (currentContext) {
    const {domCache} = currentContext
    domCache.confirmButton.disabled = true
    domCache.cancelButton.disabled = true
  }
}

sweetAlert.enableConfirmButton = () => {
  if (currentContext) {
    const {domCache} = currentContext
    domCache.confirmButton.disabled = false
  }
}

sweetAlert.disableConfirmButton = () => {
  if (currentContext) {
    const {domCache} = currentContext
    domCache.confirmButton.disabled = true
  }
}

sweetAlert.enableInput = () => {
  if (currentContext) {
    const input = sweetAlert.getInput()
    if (!input) {
      return false
    }
    if (input.type === 'radio') {
      const radiosContainer = input.parentNode.parentNode
      const radios = radiosContainer.querySelectorAll('input')
      for (let i = 0; i < radios.length; i++) {
        radios[i].disabled = false
      }
    } else {
      input.disabled = false
    }
  }
}

sweetAlert.disableInput = () => {
  if (currentContext) {
    const input = sweetAlert.getInput()
    if (!input) {
      return false
    }
    if (input && input.type === 'radio') {
      const radiosContainer = input.parentNode.parentNode
      const radios = radiosContainer.querySelectorAll('input')
      for (let i = 0; i < radios.length; i++) {
        radios[i].disabled = true
      }
    } else {
      input.disabled = true
    }
  }
}

// Show block with validation error
sweetAlert.showValidationError = (error) => {
  if (currentContext) {
    const {domCache} = currentContext
    domCache.validationError.innerHTML = error
    const popupComputedStyle = window.getComputedStyle(domCache.popup)
    domCache.validationError.style.marginLeft = `-${popupComputedStyle.getPropertyValue('padding-left')}`
    domCache.validationError.style.marginRight = `-${popupComputedStyle.getPropertyValue('padding-right')}`
    dom.show(domCache.validationError)

    const input = sweetAlert.getInput()
    if (input) {
      input.setAttribute('aria-invalid', true)
      input.setAttribute('aria-describedBy', swalClasses.validationerror)
      dom.focusInput(input)
      dom.addClass(input, swalClasses.inputerror)
    }
  }
}

// Hide block with validation error
sweetAlert.resetValidationError = () => {
  if (currentContext) {
    const {domCache} = currentContext
    if (domCache.validationError) {
      dom.hide(domCache.validationError)
    }

    const input = sweetAlert.getInput()
    if (input) {
      input.removeAttribute('aria-invalid')
      input.removeAttribute('aria-describedBy')
      dom.removeClass(input, swalClasses.inputerror)
    }
  }
}

sweetAlert.getProgressSteps = () => {
  if (currentContext) {
    const {params} = currentContext
    return params.progressSteps
  }
}

sweetAlert.setProgressSteps = (progressSteps) => {
  if (currentContext) {
    const {params} = currentContext
    params.progressSteps = progressSteps
    setParameters(params)
  }
}

sweetAlert.showProgressSteps = () => {
  if (currentContext) {
    const {domCache} = currentContext
    dom.show(domCache.progressSteps)
  }
}

sweetAlert.hideProgressSteps = () => {
  if (currentContext) {
    const {domCache} = currentContext
    dom.hide(domCache.progressSteps)
  }
}

sweetAlert.DismissReason = DismissReason

sweetAlert.noop = () => { }

sweetAlert.version = version

sweetAlert.default = sweetAlert

/**
 * Set default params if `window._swalDefaults` is an object
 */
if (typeof window !== 'undefined' && typeof window._swalDefaults === 'object') {
  sweetAlert.setDefaults(window._swalDefaults)
}

export default sweetAlert
