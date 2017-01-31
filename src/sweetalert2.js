import { defaultParams, sweetContainer } from './utils/default.js'
import { swalClasses, iconTypes } from './utils/classes.js'
import { colorLuminance } from './utils/utils.js'
import * as dom from './utils/dom.js'

let modalParams = Object.assign({}, defaultParams)
let queue = []
let swal2Observer

/*
 * Set type, text and actions on modal
 */
const setParameters = (params) => {
  const modal = dom.getModal()

  for (let param in params) {
    if (!defaultParams.hasOwnProperty(param) && param !== 'extraParams') {
      console.warn(`SweetAlert2: Unknown parameter "${param}"`)
    }
  }

  // set modal width and margin-left
  modal.style.width = (typeof params.width === 'number') ? params.width + 'px' : params.width

  modal.style.padding = params.padding + 'px'
  modal.style.background = params.background

  const title = dom.getTitle()
  const content = dom.getContent()
  const confirmButton = dom.getConfirmButton()
  const cancelButton = dom.getCancelButton()
  const closeButton = dom.getCloseButton()

  // Title
  if (params.titleText) {
    title.innerText = params.titleText
  } else {
    title.innerHTML = params.title.split('\n').join('<br>')
  }

  // Content
  if (params.text || params.html) {
    if (typeof params.html === 'object') {
      content.innerHTML = ''
      if (0 in params.html) {
        for (let i = 0; i in params.html; i++) {
          content.appendChild(params.html[i].cloneNode(true))
        }
      } else {
        content.appendChild(params.html.cloneNode(true))
      }
    } else if (params.html) {
      content.innerHTML = params.html
    } else if (params.text) {
      content.textContent = params.text
    }
    dom.show(content)
  } else {
    dom.hide(content)
  }

  // Close button
  if (params.showCloseButton) {
    dom.show(closeButton)
  } else {
    dom.hide(closeButton)
  }

  // Custom Class
  modal.className = swalClasses.modal
  if (params.customClass) {
    dom.addClass(modal, params.customClass)
  }

  // Progress steps
  let progressStepsContainer = dom.getProgressSteps()
  let currentProgressStep = parseInt(params.currentProgressStep === null ? sweetAlert.getQueueStep() : params.currentProgressStep, 10)
  if (params.progressSteps.length) {
    dom.show(progressStepsContainer)
    dom.empty(progressStepsContainer)
    if (currentProgressStep >= params.progressSteps.length) {
      console.warn(
        'SweetAlert2: Invalid currentProgressStep parameter, it should be less than progressSteps.length ' +
        '(currentProgressStep like JS arrays starts from 0)'
      )
    }
    params.progressSteps.forEach((step, index) => {
      let circle = document.createElement('li')
      dom.addClass(circle, swalClasses.progresscircle)
      circle.innerHTML = step
      if (index === currentProgressStep) {
        dom.addClass(circle, swalClasses.activeprogressstep)
      }
      progressStepsContainer.appendChild(circle)
      if (index !== params.progressSteps.length - 1) {
        let line = document.createElement('li')
        dom.addClass(line, swalClasses.progressline)
        line.style.width = params.progressStepsDistance
        progressStepsContainer.appendChild(line)
      }
    })
  } else {
    dom.hide(progressStepsContainer)
  }

  // Icon
  const icons = dom.getIcons()
  for (let i = 0; i < icons.length; i++) {
    dom.hide(icons[i])
  }
  if (params.type) {
    let validType = false
    for (let iconType in iconTypes) {
      if (params.type === iconType) {
        validType = true
        break
      }
    }
    if (!validType) {
      console.error(`SweetAlert2: Unknown alert type: ${params.type}`)
      return false
    }
    const icon = modal.querySelector(`.${swalClasses.icon}.${iconTypes[params.type]}`)
    dom.show(icon)

    // Animate icon
    switch (params.type) {
      case 'success':
        dom.addClass(icon, 'animate')
        dom.addClass(icon.querySelector('.tip'), 'animate-success-tip')
        dom.addClass(icon.querySelector('.long'), 'animate-success-long')
        break
      case 'error':
        dom.addClass(icon, 'animate-error-icon')
        dom.addClass(icon.querySelector('.x-mark'), 'animate-x-mark')
        break
      case 'warning':
        dom.addClass(icon, 'pulse-warning')
        break
      default:
        break
    }
  }

  // Custom image
  const image = dom.getImage()
  if (params.imageUrl) {
    image.setAttribute('src', params.imageUrl)
    dom.show(image)

    if (params.imageWidth) {
      image.setAttribute('width', params.imageWidth)
    } else {
      image.removeAttribute('width')
    }

    if (params.imageHeight) {
      image.setAttribute('height', params.imageHeight)
    } else {
      image.removeAttribute('height')
    }

    image.className = swalClasses.image
    if (params.imageClass) {
      dom.addClass(image, params.imageClass)
    }
  } else {
    dom.hide(image)
  }

  // Cancel button
  if (params.showCancelButton) {
    cancelButton.style.display = 'inline-block'
  } else {
    dom.hide(cancelButton)
  }

  // Confirm button
  if (params.showConfirmButton) {
    dom.removeStyleProperty(confirmButton, 'display')
  } else {
    dom.hide(confirmButton)
  }

  // Buttons spacer
  const spacer = dom.getSpacer()
  if (!params.showConfirmButton && !params.showCancelButton) {
    dom.hide(spacer)
  } else {
    dom.show(spacer)
  }

  // Edit text on cancel and confirm buttons
  confirmButton.innerHTML = params.confirmButtonText
  cancelButton.innerHTML = params.cancelButtonText

  // Set buttons to selected background colors
  if (params.buttonsStyling) {
    confirmButton.style.backgroundColor = params.confirmButtonColor
    cancelButton.style.backgroundColor = params.cancelButtonColor
  }

  // Add buttons custom classes
  confirmButton.className = swalClasses.confirm
  dom.addClass(confirmButton, params.confirmButtonClass)
  cancelButton.className = swalClasses.cancel
  dom.addClass(cancelButton, params.cancelButtonClass)

  // Buttons styling
  if (params.buttonsStyling) {
    dom.addClass(confirmButton, swalClasses.styled)
    dom.addClass(cancelButton, swalClasses.styled)
  } else {
    dom.removeClass(confirmButton, swalClasses.styled)
    dom.removeClass(cancelButton, swalClasses.styled)

    confirmButton.style.backgroundColor = confirmButton.style.borderLeftColor = confirmButton.style.borderRightColor = ''
    cancelButton.style.backgroundColor = cancelButton.style.borderLeftColor = cancelButton.style.borderRightColor = ''
  }

  // CSS animation
  if (params.animation === true) {
    dom.removeClass(modal, swalClasses.noanimation)
  } else {
    dom.addClass(modal, swalClasses.noanimation)
  }
}

/*
 * Animations
 */
const openModal = (animation, onComplete) => {
  const modal = dom.getModal()
  if (animation) {
    dom.addClass(modal, swalClasses.show)
    dom.addClass(sweetContainer, swalClasses.fade)
    dom.removeClass(modal, swalClasses.hide)
  } else {
    dom.removeClass(modal, swalClasses.fade)
  }
  dom.show(modal)

  // scrolling is 'hidden' until animation is done, after that 'auto'
  sweetContainer.style.overflowY = 'hidden'
  if (dom.animationEndEvent && !dom.hasClass(modal, swalClasses.noanimation)) {
    modal.addEventListener(dom.animationEndEvent, function swalCloseEventFinished () {
      modal.removeEventListener(dom.animationEndEvent, swalCloseEventFinished)
      sweetContainer.style.overflowY = 'auto'
    })
  } else {
    sweetContainer.style.overflowY = 'auto'
  }

  dom.addClass(sweetContainer, swalClasses.in)
  dom.addClass(document.body, swalClasses.in)
  fixScrollbar()
  iOSfix()
  dom.states.previousActiveElement = document.activeElement
  if (onComplete !== null && typeof onComplete === 'function') {
    onComplete(modal)
  }
}

const fixScrollbar = () => {
  // for queues, do not do this more than once
  if (dom.states.previousBodyPadding !== null) {
    return
  }
  // if the body has overflow
  if (document.body.scrollHeight > window.innerHeight) {
    // add padding so the content doesn't shift after removal of scrollbar
    dom.states.previousBodyPadding = document.body.style.paddingRight
    document.body.style.paddingRight = dom.measureScrollbar() + 'px'
  }
}

const undoScrollbar = () => {
  if (dom.states.previousBodyPadding !== null) {
    document.body.style.paddingRight = dom.states.previousBodyPadding
    dom.states.previousBodyPadding = null
  }
}

// Fix iOS scrolling http://stackoverflow.com/q/39626302/1331425
const iOSfix = () => {
  const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
  if (iOS && !dom.hasClass(document.body, swalClasses.iosfix)) {
    const offset = document.body.scrollTop
    document.body.style.top = (offset * -1) + 'px'
    dom.addClass(document.body, swalClasses.iosfix)
  }
}

const undoIOSfix = () => {
  if (dom.hasClass(document.body, swalClasses.iosfix)) {
    const offset = parseInt(document.body.style.top, 10)
    dom.removeClass(document.body, swalClasses.iosfix)
    document.body.style.top = ''
    document.body.scrollTop = (offset * -1)
  }
}

const modalDependant = (...args) => {
  if (args[0] === undefined) {
    console.error('SweetAlert2 expects at least 1 attribute!')
    return false
  }

  let params = Object.assign({}, modalParams)

  switch (typeof args[0]) {
    case 'string':
      [params.title, params.html, params.type] = args
      break

    case 'object':
      Object.assign(params, args[0])
      params.extraParams = args[0].extraParams

      if (params.input === 'email' && params.inputValidator === null) {
        params.inputValidator = (email) => {
          return new Promise((resolve, reject) => {
            const emailRegex = /^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
            if (emailRegex.test(email)) {
              resolve()
            } else {
              reject('Invalid email address')
            }
          })
        }
      }
      break

    default:
      console.error('SweetAlert2: Unexpected type of argument! Expected "string" or "object", got ' + typeof args[0])
      return false
  }

  setParameters(params)

  const modal = dom.getModal()

  return new Promise((resolve, reject) => {
    // Close on timer
    if (params.timer) {
      modal.timeout = setTimeout(() => {
        sweetAlert.closeModal(params.onClose)
        reject('timer')
      }, params.timer)
    }

    // Get input element by specified type or, if type isn't specified, by params.input
    const getInput = (inputType) => {
      inputType = inputType || params.input
      if (!inputType) {
        return null
      }
      switch (inputType) {
        case 'select':
        case 'textarea':
        case 'file':
          return dom.getChildByClass(modal, swalClasses[inputType])
        case 'checkbox':
          return modal.querySelector(`.${swalClasses.checkbox} input`)
        case 'radio':
          return modal.querySelector(`.${swalClasses.radio} input:checked`) ||
            modal.querySelector(`.${swalClasses.radio} input:first-child`)
        case 'range':
          return modal.querySelector(`.${swalClasses.range} input`)
        default:
          return dom.getChildByClass(modal, swalClasses.input)
      }
    }

    // Get the value of the modal input
    const getInputValue = () => {
      const input = getInput()
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
        const input = getInput()
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
        params.preConfirm(value, params.extraParams).then(
          (preConfirmValue) => {
            sweetAlert.closeModal(params.onClose)
            resolve(preConfirmValue || value)
          },
          (error) => {
            sweetAlert.hideLoading()
            if (error) {
              sweetAlert.showValidationError(error)
            }
          }
        )
      } else {
        sweetAlert.closeModal(params.onClose)
        resolve(value)
      }
    }

    // Mouse interactions
    const onButtonEvent = (event) => {
      const e = event || window.event
      const target = e.target || e.srcElement
      const confirmButton = dom.getConfirmButton()
      const cancelButton = dom.getCancelButton()
      const targetedConfirm = confirmButton === target || confirmButton.contains(target)
      const targetedCancel = cancelButton === target || cancelButton.contains(target)

      switch (e.type) {
        case 'mouseover':
        case 'mouseup':
          if (params.buttonsStyling) {
            if (targetedConfirm) {
              confirmButton.style.backgroundColor = colorLuminance(params.confirmButtonColor, -0.1)
            } else if (targetedCancel) {
              cancelButton.style.backgroundColor = colorLuminance(params.cancelButtonColor, -0.1)
            }
          }
          break
        case 'mouseout':
          if (params.buttonsStyling) {
            if (targetedConfirm) {
              confirmButton.style.backgroundColor = params.confirmButtonColor
            } else if (targetedCancel) {
              cancelButton.style.backgroundColor = params.cancelButtonColor
            }
          }
          break
        case 'mousedown':
          if (params.buttonsStyling) {
            if (targetedConfirm) {
              confirmButton.style.backgroundColor = colorLuminance(params.confirmButtonColor, -0.2)
            } else if (targetedCancel) {
              cancelButton.style.backgroundColor = colorLuminance(params.cancelButtonColor, -0.2)
            }
          }
          break
        case 'click':
          // Clicked 'confirm'
          if (targetedConfirm && sweetAlert.isVisible()) {
            if (params.input) {
              const inputValue = getInputValue()

              if (params.inputValidator) {
                sweetAlert.disableInput()
                params.inputValidator(inputValue, params.extraParams).then(
                  () => {
                    sweetAlert.enableInput()
                    confirm(inputValue)
                  },
                  (error) => {
                    sweetAlert.enableInput()
                    if (error) {
                      sweetAlert.showValidationError(error)
                    }
                  }
                )
              } else {
                confirm(inputValue)
              }
            } else {
              confirm(true)
            }

          // Clicked 'cancel'
          } else if (targetedCancel && sweetAlert.isVisible()) {
            sweetAlert.closeModal(params.onClose)
            reject('cancel')
          }
          break
        default:
      }
    }

    const buttons = modal.querySelectorAll('button')
    for (let i = 0; i < buttons.length; i++) {
      buttons[i].onclick = onButtonEvent
      buttons[i].onmouseover = onButtonEvent
      buttons[i].onmouseout = onButtonEvent
      buttons[i].onmousedown = onButtonEvent
    }

    // Closing modal by close button
    dom.getCloseButton().onclick = () => {
      sweetAlert.closeModal(params.onClose)
      reject('close')
    }

    // Closing modal by overlay click
    sweetContainer.onclick = (e) => {
      if (e.target !== sweetContainer) {
        return
      }
      if (params.allowOutsideClick) {
        sweetAlert.closeModal(params.onClose)
        reject('overlay')
      }
    }

    const confirmButton = dom.getConfirmButton()
    const cancelButton = dom.getCancelButton()

    // Reverse buttons if neede d
    if (params.reverseButtons) {
      confirmButton.parentNode.insertBefore(cancelButton, confirmButton)
    } else {
      confirmButton.parentNode.insertBefore(confirmButton, cancelButton)
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
      const keyCode = e.keyCode || e.which

      if ([9, 13, 32, 27].indexOf(keyCode) === -1) {
        // Don't do work on keys we don't care about.
        return
      }

      const targetElement = e.target || e.srcElement

      const focusableElements = dom.getFocusableElements(params.focusCancel)
      let btnIndex = -1 // Find the button - note, this is a nodelist, not an array.
      for (let i = 0; i < focusableElements.length; i++) {
        if (targetElement === focusableElements[i]) {
          btnIndex = i
          break
        }
      }

      // TAB
      if (keyCode === 9) {
        if (!e.shiftKey) {
          // Cycle to the next button
          setFocus(btnIndex, 1)
        } else {
          // Cycle to the prev button
          setFocus(btnIndex, -1)
        }
        e.stopPropagation()
        e.preventDefault()

      // ENTER/SPACE
      } else {
        if (keyCode === 13 || keyCode === 32) {
          if (btnIndex === -1) {
            // ENTER/SPACE clicked outside of a button.
            if (params.focusCancel) {
              dom.fireClick(cancelButton, e)
            } else {
              dom.fireClick(confirmButton, e)
            }
          }
        } else if (keyCode === 27 && params.allowEscapeKey === true) {
          sweetAlert.closeModal(params.onClose)
          reject('esc')
        }
      }
    }

    dom.states.previousWindowKeyDown = window.onkeydown
    window.onkeydown = handleKeyDown

    // Loading state
    if (params.buttonsStyling) {
      confirmButton.style.borderLeftColor = params.confirmButtonColor
      confirmButton.style.borderRightColor = params.confirmButtonColor
    }

    /**
     * Show spinner instead of Confirm button and disable Cancel button
     */
    sweetAlert.showLoading = sweetAlert.enableLoading = () => {
      dom.show(dom.getSpacer())
      dom.show(confirmButton, 'inline-block')
      dom.addClass(confirmButton, swalClasses.loading)
      dom.addClass(modal, swalClasses.loading)
      confirmButton.disabled = true
      cancelButton.disabled = true
    }

    /**
     * Show spinner instead of Confirm button and disable Cancel button
     */
    sweetAlert.hideLoading = sweetAlert.disableLoading = () => {
      if (!params.showConfirmButton) {
        dom.hide(confirmButton)
        if (!params.showCancelButton) {
          dom.hide(dom.getSpacer())
        }
      }
      dom.removeClass(confirmButton, swalClasses.loading)
      dom.removeClass(modal, swalClasses.loading)
      confirmButton.disabled = false
      cancelButton.disabled = false
    }

    sweetAlert.getTitle = () => dom.getTitle()
    sweetAlert.getContent = () => dom.getContent()
    sweetAlert.getInput = () => getInput()
    sweetAlert.getImage = () => dom.getImage()
    sweetAlert.getConfirmButton = () => dom.getConfirmButton()
    sweetAlert.getCancelButton = () => dom.getCancelButton()

    sweetAlert.enableButtons = () => {
      confirmButton.disabled = false
      cancelButton.disabled = false
    }

    sweetAlert.disableButtons = () => {
      confirmButton.disabled = true
      cancelButton.disabled = true
    }

    sweetAlert.enableConfirmButton = () => {
      confirmButton.disabled = false
    }

    sweetAlert.disableConfirmButton = () => {
      confirmButton.disabled = true
    }

    sweetAlert.enableInput = () => {
      const input = getInput()
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

    sweetAlert.disableInput = () => {
      const input = getInput()
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

    // Set modal min-height to disable scrolling inside the modal
    sweetAlert.recalculateHeight = dom.debounce(() => {
      const modal = dom.getModal()
      const prevState = modal.style.display
      modal.style.minHeight = ''
      dom.show(modal)
      modal.style.minHeight = (modal.scrollHeight + 1) + 'px'
      modal.style.display = prevState
    }, 50)

    // Show block with validation error
    sweetAlert.showValidationError = (error) => {
      const validationError = dom.getValidationError()
      validationError.innerHTML = error
      dom.show(validationError)

      const input = getInput()
      if (input) {
        dom.focusInput(input)
        dom.addClass(input, swalClasses.inputerror)
      }
    }

    // Hide block with validation error
    sweetAlert.resetValidationError = () => {
      const validationError = dom.getValidationError()
      dom.hide(validationError)
      sweetAlert.recalculateHeight()

      const input = getInput()
      if (input) {
        dom.removeClass(input, swalClasses.inputerror)
      }
    }

    sweetAlert.getProgressSteps = () => {
      return params.progressSteps
    }

    sweetAlert.setProgressSteps = (progressSteps) => {
      params.progressSteps = progressSteps
      setParameters(params)
    }

    sweetAlert.showProgressSteps = () => {
      dom.show(dom.getProgressSteps())
    }

    sweetAlert.hideProgressSteps = () => {
      dom.hide(dom.getProgressSteps())
    }

    sweetAlert.enableButtons()
    sweetAlert.hideLoading()
    sweetAlert.resetValidationError()

    // inputs
    const inputTypes = ['input', 'file', 'range', 'select', 'radio', 'checkbox', 'textarea']
    let input
    for (let i = 0; i < inputTypes.length; i++) {
      const inputClass = swalClasses[inputTypes[i]]
      const inputContainer = dom.getChildByClass(modal, inputClass)
      input = getInput(inputTypes[i])

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
        input = dom.getChildByClass(modal, swalClasses.input)
        input.value = params.inputValue
        input.placeholder = params.inputPlaceholder
        input.type = params.input
        dom.show(input)
        break
      case 'file':
        input = dom.getChildByClass(modal, swalClasses.file)
        input.placeholder = params.inputPlaceholder
        input.type = params.input
        dom.show(input)
        break
      case 'range':
        const range = dom.getChildByClass(modal, swalClasses.range)
        const rangeInput = range.querySelector('input')
        const rangeOutput = range.querySelector('output')
        rangeInput.value = params.inputValue
        rangeInput.type = params.input
        rangeOutput.value = params.inputValue
        dom.show(range)
        break
      case 'select':
        const select = dom.getChildByClass(modal, swalClasses.select)
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
          for (let optionValue in inputOptions) {
            const option = document.createElement('option')
            option.value = optionValue
            option.innerHTML = inputOptions[optionValue]
            if (params.inputValue === optionValue) {
              option.selected = true
            }
            select.appendChild(option)
          }
          dom.show(select)
          select.focus()
        }
        break
      case 'radio':
        const radio = dom.getChildByClass(modal, swalClasses.radio)
        radio.innerHTML = ''
        populateInputOptions = (inputOptions) => {
          for (let radioValue in inputOptions) {
            const radioInput = document.createElement('input')
            const radioLabel = document.createElement('label')
            const radioLabelSpan = document.createElement('span')
            radioInput.type = 'radio'
            radioInput.name = swalClasses.radio
            radioInput.value = radioValue
            if (params.inputValue === radioValue) {
              radioInput.checked = true
            }
            radioLabelSpan.innerHTML = inputOptions[radioValue]
            radioLabel.appendChild(radioInput)
            radioLabel.appendChild(radioLabelSpan)
            radioLabel.for = radioInput.id
            radio.appendChild(radioLabel)
          }
          dom.show(radio)
          const radios = radio.querySelectorAll('input')
          if (radios.length) {
            radios[0].focus()
          }
        }
        break
      case 'checkbox':
        const checkbox = dom.getChildByClass(modal, swalClasses.checkbox)
        const checkboxInput = getInput('checkbox')
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
        const textarea = dom.getChildByClass(modal, swalClasses.textarea)
        textarea.value = params.inputValue
        textarea.placeholder = params.inputPlaceholder
        dom.show(textarea)
        break
      case null:
        break
      default:
        console.error('SweetAlert2: Unexpected type of input! Expected "text", "email", "password", "select", "checkbox", "textarea" or "file", got "' + params.input + '"')
        break
    }

    if (params.input === 'select' || params.input === 'radio') {
      if (params.inputOptions instanceof Promise) {
        sweetAlert.showLoading()
        params.inputOptions.then((inputOptions) => {
          sweetAlert.hideLoading()
          populateInputOptions(inputOptions)
        })
      } else if (typeof params.inputOptions === 'object') {
        populateInputOptions(params.inputOptions)
      } else {
        console.error('SweetAlert2: Unexpected type of inputOptions! Expected object or Promise, got ' + typeof params.inputOptions)
      }
    }

    openModal(params.animation, params.onOpen)

    // Focus the first element (input or button)
    setFocus(-1, 1)

    // fix scroll
    sweetContainer.scrollTop = 0

    // Observe changes inside the modal and adjust height
    if (typeof MutationObserver !== 'undefined' && !swal2Observer) {
      swal2Observer = new MutationObserver(sweetAlert.recalculateHeight)
      swal2Observer.observe(modal, {childList: true, characterData: true, subtree: true})
    }
  })
}

// SweetAlert entry point
const sweetAlert = (...args) => {
  if (sweetAlert.isVisible()) {
    sweetAlert.close()
  }

  return modalDependant.apply(undefined, args)
}

/*
 * Global function to determine if swal2 modal is visible
 */
sweetAlert.isVisible = () => {
  const modal = dom.getModal()
  return dom.isVisible(modal)
}

/*
 * Global function for chaining sweetAlert modals
 */
sweetAlert.queue = (steps) => {
  queue = steps
  const modal = dom.getModal()
  const resetQueue = () => {
    queue = []
    modal.removeAttribute('data-queue-step')
  }
  let queueResult = []
  return new Promise((resolve, reject) => {
    (function step (i, callback) {
      if (i < queue.length) {
        modal.setAttribute('data-queue-step', i)

        sweetAlert(queue[i]).then(
          (result) => {
            queueResult.push(result)
            step(i + 1, callback)
          },
          (dismiss) => {
            resetQueue()
            reject(dismiss)
          }
        )
      } else {
        resetQueue()
        resolve(queueResult)
      }
    })(0)
  })
}

/*
 * Global function for getting the index of current modal in queue
 */
sweetAlert.getQueueStep = () => dom.getModal().getAttribute('data-queue-step')

/*
 * Global function for inserting a modal to the queue
 */
sweetAlert.insertQueueStep = (step, index) => {
  if (index && index < queue.length) {
    return queue.splice(index, 0, step)
  }
  return queue.push(step)
}

/*
 * Global function for deleting a modal from the queue
 */
sweetAlert.deleteQueueStep = (index) => {
  if (typeof queue[index] !== 'undefined') {
    queue.splice(index, 1)
  }
}

/*
 * Global function to close sweetAlert
 */
sweetAlert.close = sweetAlert.closeModal = (onComplete) => {
  const modal = dom.getModal()
  dom.removeClass(modal, swalClasses.show)
  dom.addClass(modal, swalClasses.hide)

  // Reset icon animations
  const successIcon = modal.querySelector('.' + swalClasses.icon + '.' + iconTypes.success)
  dom.removeClass(successIcon, 'animate')
  dom.removeClass(successIcon.querySelector('.tip'), 'animate-success-tip')
  dom.removeClass(successIcon.querySelector('.long'), 'animate-success-long')

  const errorIcon = modal.querySelector('.' + swalClasses.icon + '.' + iconTypes.error)
  dom.removeClass(errorIcon, 'animate-error-icon')
  dom.removeClass(errorIcon.querySelector('.x-mark'), 'animate-x-mark')

  const warningIcon = modal.querySelector('.' + swalClasses.icon + '.' + iconTypes.warning)
  dom.removeClass(warningIcon, 'pulse-warning')

  dom.resetPrevState()

  const hideModalAndResetState = () => {
    dom.hide(modal)
    modal.style.minHeight = ''
    dom.removeClass(sweetContainer, swalClasses.in)
    dom.removeClass(document.body, swalClasses.in)
    undoScrollbar()
    undoIOSfix()
  }

  // If animation is supported, animate
  if (dom.animationEndEvent && !dom.hasClass(modal, swalClasses.noanimation)) {
    modal.addEventListener(dom.animationEndEvent, function swalCloseEventFinished () {
      modal.removeEventListener(dom.animationEndEvent, swalCloseEventFinished)
      if (dom.hasClass(modal, swalClasses.hide)) {
        hideModalAndResetState()
      }
    })
  } else {
    // Otherwise, hide immediately
    hideModalAndResetState()
  }
  if (onComplete !== null && typeof onComplete === 'function') {
    onComplete(modal)
  }
}

/*
 * Global function to click 'Confirm' button
 */
sweetAlert.clickConfirm = () => dom.getConfirmButton().click()

/*
 * Global function to click 'Cancel' button
 */
sweetAlert.clickCancel = () => dom.getCancelButton().click()

/**
 * Set default params for each popup
 * @param {Object} userParams
 */
sweetAlert.setDefaults = (userParams) => {
  if (!userParams || typeof userParams !== 'object') {
    return console.error('SweetAlert2: the argument for setDefaults() is required and has to be a object')
  }

  for (let param in userParams) {
    if (!defaultParams.hasOwnProperty(param) && param !== 'extraParams') {
      console.warn(`SweetAlert2: Unknown parameter "${param}"`)
      delete userParams[param]
    }
  }

  Object.assign(modalParams, userParams)
}

/**
 * Reset default params for each popup
 */
sweetAlert.resetDefaults = () => {
  modalParams = Object.assign({}, defaultParams)
}

sweetAlert.noop = () => { }

sweetAlert.version = ''

sweetAlert.default = sweetAlert

export default sweetAlert
