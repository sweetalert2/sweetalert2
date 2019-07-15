import defaultParams, { showWarningsForParams } from '../utils/params.js'
import * as dom from '../utils/dom/index.js'
import { swalClasses } from '../utils/classes.js'
import Timer from '../utils/Timer.js'
import { callIfFunction, isPromise } from '../utils/utils.js'
import setParameters from '../utils/setParameters.js'
import globalState from '../globalState.js'
import { openPopup } from '../utils/openPopup.js'
import privateProps from '../privateProps.js'
import privateMethods from '../privateMethods.js'
import { handleInputOptions, handleInputValue } from '../utils/dom/inputUtils.js'

export function _main (userParams) {
  showWarningsForParams(userParams)

  // Check if there is another Swal closing
  if (dom.getPopup() && globalState.swalCloseEventFinishedCallback) {
    globalState.swalCloseEventFinishedCallback()
    delete globalState.swalCloseEventFinishedCallback
  }

  // Check if there is a swal disposal defer timer
  if (globalState.deferDisposalTimer) {
    clearTimeout(globalState.deferDisposalTimer)
    delete globalState.deferDisposalTimer
  }

  const innerParams = Object.assign({}, defaultParams, userParams)
  setParameters(innerParams)
  Object.freeze(innerParams)

  // clear the previous timer
  if (globalState.timeout) {
    globalState.timeout.stop()
    delete globalState.timeout
  }

  // clear the restore focus timeout
  clearTimeout(globalState.restoreFocusTimeout)

  const domCache = {
    popup: dom.getPopup(),
    container: dom.getContainer(),
    content: dom.getContent(),
    actions: dom.getActions(),
    confirmButton: dom.getConfirmButton(),
    cancelButton: dom.getCancelButton(),
    closeButton: dom.getCloseButton(),
    validationMessage: dom.getValidationMessage(),
    progressSteps: dom.getProgressSteps()
  }
  privateProps.domCache.set(this, domCache)

  dom.render(this, innerParams)

  privateProps.innerParams.set(this, innerParams)

  const constructor = this.constructor

  return new Promise((resolve) => {
    // functions to handle all closings/dismissals
    const succeedWith = (value) => {
      this.closePopup({ value })
    }
    const dismissWith = (dismiss) => {
      this.closePopup({ dismiss })
    }

    privateMethods.swalPromiseResolve.set(this, resolve)

    // Close on timer
    if (innerParams.timer) {
      globalState.timeout = new Timer(() => {
        dismissWith('timer')
        delete globalState.timeout
      }, innerParams.timer)
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
        this.resetValidationMessage()
        const preConfirmPromise = Promise.resolve().then(() => innerParams.preConfirm(value, innerParams.validationMessage))
        preConfirmPromise.then(
          (preConfirmValue) => {
            if (dom.isVisible(domCache.validationMessage) || preConfirmValue === false) {
              this.hideLoading()
            } else {
              succeedWith(typeof (preConfirmValue) === 'undefined' ? value : preConfirmValue)
            }
          }
        )
      } else {
        succeedWith(value)
      }
    }

    // Mouse interactions
    const onButtonEvent = (e) => {
      const target = e.target
      const { confirmButton, cancelButton } = domCache
      const targetedConfirm = confirmButton && (confirmButton === target || confirmButton.contains(target))
      const targetedCancel = cancelButton && (cancelButton === target || cancelButton.contains(target))

      switch (e.type) {
        case 'click':
          // Clicked 'confirm'
          if (targetedConfirm) {
            this.disableButtons()
            if (innerParams.input) {
              const inputValue = getInputValue()

              if (innerParams.inputValidator) {
                this.disableInput()
                const validationPromise = Promise.resolve().then(() => innerParams.inputValidator(inputValue, innerParams.validationMessage))
                validationPromise.then(
                  (validationMessage) => {
                    this.enableButtons()
                    this.enableInput()
                    if (validationMessage) {
                      this.showValidationMessage(validationMessage)
                    } else {
                      confirm(inputValue)
                    }
                  }
                )
              } else if (!this.getInput().checkValidity()) {
                this.enableButtons()
                this.showValidationMessage(innerParams.validationMessage)
              } else {
                confirm(inputValue)
              }
            } else {
              confirm(true)
            }

          // Clicked 'cancel'
          } else if (targetedCancel) {
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
      domCache.popup.onclick = () => {
        if (
          innerParams.showConfirmButton ||
          innerParams.showCancelButton ||
          innerParams.showCloseButton ||
          innerParams.input
        ) {
          return
        }
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

        return focusableElements[index].focus()
      }
      // no visible focusable elements, focus the popup
      domCache.popup.focus()
    }

    const keydownHandler = (e, innerParams) => {
      if (innerParams.stopKeydownPropagation) {
        e.stopPropagation()
      }

      const arrowKeys = [
        'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
        'Left', 'Right', 'Up', 'Down' // IE11
      ]

      if (e.key === 'Enter' && !e.isComposing) {
        if (e.target && this.getInput() && e.target.outerHTML === this.getInput().outerHTML) {
          if (['textarea', 'file'].includes(innerParams.input)) {
            return // do not submit
          }

          constructor.clickConfirm()
          e.preventDefault()
        }

        // TAB
      } else if (e.key === 'Tab') {
        const targetElement = e.target

        const focusableElements = dom.getFocusableElements(innerParams.focusCancel)
        let btnIndex = -1
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
        e.preventDefault()
        dismissWith(constructor.DismissReason.esc)
      }
    }

    if (globalState.keydownTarget && globalState.keydownHandlerAdded) {
      globalState.keydownTarget.removeEventListener('keydown', globalState.keydownHandler, { capture: globalState.keydownListenerCapture })
      globalState.keydownHandlerAdded = false
    }

    if (!innerParams.toast) {
      globalState.keydownHandler = (e) => keydownHandler(e, innerParams)
      globalState.keydownTarget = innerParams.keydownListenerCapture ? window : domCache.popup
      globalState.keydownListenerCapture = innerParams.keydownListenerCapture
      globalState.keydownTarget.addEventListener('keydown', globalState.keydownHandler, { capture: globalState.keydownListenerCapture })
      globalState.keydownHandlerAdded = true
    }

    this.enableButtons()
    this.hideLoading()
    this.resetValidationMessage()

    if (innerParams.toast && (innerParams.input || innerParams.footer || innerParams.showCloseButton)) {
      dom.addClass(document.body, swalClasses['toast-column'])
    } else {
      dom.removeClass(document.body, swalClasses['toast-column'])
    }

    // inputOptions, inputValue
    if (innerParams.input === 'select' || innerParams.input === 'radio') {
      handleInputOptions(this, innerParams)
    } else if (['text', 'email', 'number', 'tel', 'textarea'].includes(innerParams.input) && isPromise(innerParams.inputValue)) {
      handleInputValue(this, innerParams)
    }

    openPopup(innerParams)

    if (!innerParams.toast) {
      if (!callIfFunction(innerParams.allowEnterKey)) {
        if (document.activeElement && typeof document.activeElement.blur === 'function') {
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
