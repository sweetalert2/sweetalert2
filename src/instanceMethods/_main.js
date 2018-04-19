import defaultParams, {showWarningsForParams} from '../utils/params'
import * as dom from '../utils/dom/index'
import { swalClasses } from '../utils/classes'
import { formatInputOptions, error, callIfFunction, isThenable } from '../utils/utils'
import setParameters from '../utils/setParameters'
import globalState from '../globalState'
import { openPopup } from '../utils/openPopup'
import privateProps from '../privateProps'

export function _main (userParams) {
  showWarningsForParams(userParams)

  const innerParams = Object.assign({}, defaultParams, userParams)
  setParameters(innerParams)
  Object.freeze(innerParams)
  privateProps.innerParams.set(this, innerParams)

  const domCache = {
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
  privateProps.domCache.set(this, domCache)

  const constructor = this.constructor

  return new Promise((resolve, reject) => {
    // functions to handle all resolving/rejecting/settling
    const succeedWith = (value) => {
      constructor.closePopup(innerParams.onClose, innerParams.onAfterClose) // TODO: make closePopup an *instance* method
      if (innerParams.useRejections) {
        resolve(value)
      } else {
        resolve({value})
      }
    }
    const dismissWith = (dismiss) => {
      constructor.closePopup(innerParams.onClose, innerParams.onAfterClose)
      if (innerParams.useRejections) {
        reject(dismiss)
      } else {
        resolve({dismiss})
      }
    }
    const errorWith = (error) => {
      constructor.closePopup(innerParams.onClose, innerParams.onAfterClose)
      reject(error)
    }

    // Close on timer
    if (innerParams.timer) {
      domCache.popup.timeout = setTimeout(() => dismissWith('timer'), innerParams.timer)
    }

    // Get the value of the popup input
    const getInputValue = () => {
      const input = this.getInput()
      if (!input) {
        return null
      }
      switch (innerParams.input) {
        case 'checkbox':
          return input.checked ? 1 : 0
        case 'radio':
          return input.checked ? input.value : null
        case 'file':
          return input.files.length ? input.files[0] : null
        default:
          return innerParams.inputAutoTrim ? input.value.trim() : input.value
      }
    }

    // input autofocus
    if (innerParams.input) {
      setTimeout(() => {
        const input = this.getInput()
        if (input) {
          dom.focusInput(input)
        }
      }, 0)
    }

    const confirm = (value) => {
      if (innerParams.showLoaderOnConfirm) {
        constructor.showLoading() // TODO: make showLoading an *instance* method
      }

      if (innerParams.preConfirm) {
        this.resetValidationError()
        const preConfirmPromise = Promise.resolve().then(() => innerParams.preConfirm(value, innerParams.extraParams))
        if (innerParams.expectRejections) {
          preConfirmPromise.then(
            (preConfirmValue) => succeedWith(preConfirmValue || value),
            (validationError) => {
              this.hideLoading()
              if (validationError) {
                this.showValidationError(validationError)
              }
            }
          )
        } else {
          preConfirmPromise.then(
            (preConfirmValue) => {
              if (dom.isVisible(domCache.validationError) || preConfirmValue === false) {
                this.hideLoading()
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
          if (targetedConfirm && constructor.isVisible()) {
            this.disableButtons()
            if (innerParams.input) {
              const inputValue = getInputValue()

              if (innerParams.inputValidator) {
                this.disableInput()
                const validationPromise = Promise.resolve().then(() => innerParams.inputValidator(inputValue, innerParams.extraParams))
                if (innerParams.expectRejections) {
                  validationPromise.then(
                    () => {
                      this.enableButtons()
                      this.enableInput()
                      confirm(inputValue)
                    },
                    (validationError) => {
                      this.enableButtons()
                      this.enableInput()
                      if (validationError) {
                        this.showValidationError(validationError)
                      }
                    }
                  )
                } else {
                  validationPromise.then(
                    (validationError) => {
                      this.enableButtons()
                      this.enableInput()
                      if (validationError) {
                        this.showValidationError(validationError)
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
          } else if (targetedCancel && constructor.isVisible()) {
            this.disableButtons()
            dismissWith(constructor.DismissReason.cancel)
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
      dismissWith(constructor.DismissReason.close)
    }

    if (innerParams.toast) {
      // Closing popup by internal click
      domCache.popup.onclick = (e) => {
        if (
          innerParams.showConfirmButton ||
          innerParams.showCancelButton ||
          innerParams.showCloseButton ||
          innerParams.input
        ) {
          return
        }
        constructor.closePopup(innerParams.onClose, innerParams.onAfterClose)
        dismissWith(constructor.DismissReason.close)
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
        if (callIfFunction(innerParams.allowOutsideClick)) {
          dismissWith(constructor.DismissReason.backdrop)
        }
      }
    }

    // Reverse buttons (Confirm on the right side)
    if (innerParams.reverseButtons) {
      domCache.confirmButton.parentNode.insertBefore(domCache.cancelButton, domCache.confirmButton)
    } else {
      domCache.confirmButton.parentNode.insertBefore(domCache.confirmButton, domCache.cancelButton)
    }

    // Focus handling
    const setFocus = (index, increment) => {
      const focusableElements = dom.getFocusableElements(innerParams.focusCancel)
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
        if (e.target === this.getInput()) {
          if (['textarea', 'file'].includes(innerParams.input)) {
            return // do not submit
          }

          constructor.clickConfirm()
          e.preventDefault()
        }

        // TAB
      } else if (e.key === 'Tab') {
        const targetElement = e.target || e.srcElement

        const focusableElements = dom.getFocusableElements(innerParams.focusCancel)
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
      } else if ((e.key === 'Escape' || e.key === 'Esc') && callIfFunction(innerParams.allowEscapeKey) === true) {
        dismissWith(constructor.DismissReason.esc)
      }
    }

    if (innerParams.toast && globalState.windowOnkeydownOverridden) {
      window.onkeydown = globalState.previousWindowKeyDown
      globalState.windowOnkeydownOverridden = false
    }

    if (!innerParams.toast && !globalState.windowOnkeydownOverridden) {
      globalState.previousWindowKeyDown = window.onkeydown
      globalState.windowOnkeydownOverridden = true
      window.onkeydown = handleKeyDown
    }

    this.enableButtons()
    this.hideLoading()
    this.resetValidationError()

    if (innerParams.input) {
      dom.addClass(document.body, swalClasses['has-input'])
    }

    // inputs
    const inputTypes = ['input', 'file', 'range', 'select', 'radio', 'checkbox', 'textarea']
    let input
    for (let i = 0; i < inputTypes.length; i++) {
      const inputClass = swalClasses[inputTypes[i]]
      const inputContainer = dom.getChildByClass(domCache.content, inputClass)
      input = this.getInput(inputTypes[i])

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
        for (let attr in innerParams.inputAttributes) {
          input.setAttribute(attr, innerParams.inputAttributes[attr])
        }
      }

      // set class
      inputContainer.className = inputClass
      if (innerParams.inputClass) {
        dom.addClass(inputContainer, innerParams.inputClass)
      }

      dom.hide(inputContainer)
    }

    let populateInputOptions
    switch (innerParams.input) {
      case 'text':
      case 'email':
      case 'password':
      case 'number':
      case 'tel':
      case 'url':
        input = dom.getChildByClass(domCache.content, swalClasses.input)
        input.value = innerParams.inputValue
        input.placeholder = innerParams.inputPlaceholder
        input.type = innerParams.input
        dom.show(input)
        break
      case 'file':
        input = dom.getChildByClass(domCache.content, swalClasses.file)
        input.placeholder = innerParams.inputPlaceholder
        input.type = innerParams.input
        dom.show(input)
        break
      case 'range':
        const range = dom.getChildByClass(domCache.content, swalClasses.range)
        const rangeInput = range.querySelector('input')
        const rangeOutput = range.querySelector('output')
        rangeInput.value = innerParams.inputValue
        rangeInput.type = innerParams.input
        rangeOutput.value = innerParams.inputValue
        dom.show(range)
        break
      case 'select':
        const select = dom.getChildByClass(domCache.content, swalClasses.select)
        select.innerHTML = ''
        if (innerParams.inputPlaceholder) {
          const placeholder = document.createElement('option')
          placeholder.innerHTML = innerParams.inputPlaceholder
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
            if (innerParams.inputValue.toString() === optionValue.toString()) {
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
            if (innerParams.inputValue.toString() === radioValue.toString()) {
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
        const checkboxInput = this.getInput('checkbox')
        checkboxInput.type = 'checkbox'
        checkboxInput.value = 1
        checkboxInput.id = swalClasses.checkbox
        checkboxInput.checked = Boolean(innerParams.inputValue)
        let label = checkbox.getElementsByTagName('span')
        if (label.length) {
          checkbox.removeChild(label[0])
        }
        label = document.createElement('span')
        label.innerHTML = innerParams.inputPlaceholder
        checkbox.appendChild(label)
        dom.show(checkbox)
        break
      case 'textarea':
        const textarea = dom.getChildByClass(domCache.content, swalClasses.textarea)
        textarea.value = innerParams.inputValue
        textarea.placeholder = innerParams.inputPlaceholder
        dom.show(textarea)
        break
      case null:
        break
      default:
        error(`Unexpected type of input! Expected "text", "email", "password", "number", "tel", "select", "radio", "checkbox", "textarea", "file" or "url", got "${innerParams.input}"`)
        break
    }

    if (innerParams.input === 'select' || innerParams.input === 'radio') {
      const processInputOptions = inputOptions => populateInputOptions(formatInputOptions(inputOptions))
      if (isThenable(innerParams.inputOptions)) {
        constructor.showLoading()
        innerParams.inputOptions.then((inputOptions) => {
          this.hideLoading()
          processInputOptions(inputOptions)
        })
      } else if (typeof innerParams.inputOptions === 'object') {
        processInputOptions(innerParams.inputOptions)
      } else {
        error('Unexpected type of inputOptions! Expected object, Map or Promise, got ' + typeof innerParams.inputOptions)
      }
    } else if (['text', 'email', 'number', 'tel', 'textarea'].includes(innerParams.input) && isThenable(innerParams.inputValue)) {
      constructor.showLoading()
      dom.hide(input)
      innerParams.inputValue.then((inputValue) => {
        input.value = innerParams.input === 'number' ? parseFloat(inputValue) || 0 : inputValue + ''
        dom.show(input)
        this.hideLoading()
      })
        .catch((err) => {
          error('Error in inputValue promise: ' + err)
          input.value = ''
          dom.show(input)
          this.hideLoading()
        })
    }

    openPopup(innerParams.animation, innerParams.onBeforeOpen, innerParams.onOpen)

    if (!innerParams.toast) {
      if (!callIfFunction(innerParams.allowEnterKey)) {
        if (document.activeElement) {
          document.activeElement.blur()
        }
      } else if (innerParams.focusCancel && dom.isVisible(domCache.cancelButton)) {
        domCache.cancelButton.focus()
      } else if (innerParams.focusConfirm && dom.isVisible(domCache.confirmButton)) {
        domCache.confirmButton.focus()
      } else {
        setFocus(-1, 1)
      }
    }

    // fix scroll
    domCache.container.scrollTop = 0
  })
}
