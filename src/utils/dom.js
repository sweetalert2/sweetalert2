/* global MouseEvent */

import { default as sweetAlert } from '../sweetalert2.js'
import { swalPrefix, swalClasses } from './classes.js'
import { sweetContainer } from './default.js'

// Remember state in cases where opening and handling a modal will fiddle with it.
export const states = {
  previousWindowKeyDown: null,
  previousActiveElement: null,
  previousBodyPadding: null
}

/*
 * Add modal + overlay to DOM
 */
export const init = () => {
  if (typeof document === 'undefined') {
    console.error('SweetAlert2 requires document to initialize')
    return
  } else if (document.getElementsByClassName(swalClasses.container).length) {
    return
  }

  document.body.appendChild(sweetContainer)

  const modal = getModal()
  const input = getChildByClass(modal, swalClasses.input)
  const file = getChildByClass(modal, swalClasses.file)
  const range = modal.querySelector(`.${swalClasses.range} input`)
  const rangeOutput = modal.querySelector(`.${swalClasses.range} output`)
  const select = getChildByClass(modal, swalClasses.select)
  const checkbox = modal.querySelector(`.${swalClasses.checkbox} input`)
  const textarea = getChildByClass(modal, swalClasses.textarea)

  input.oninput = () => {
    sweetAlert.resetValidationError()
  }

  input.onkeydown = (event) => {
    setTimeout(() => {
      if (event.keyCode === 13) {
        event.stopPropagation()
        sweetAlert.clickConfirm()
      }
    }, 0)
  }

  file.onchange = () => {
    sweetAlert.resetValidationError()
  }

  range.oninput = () => {
    sweetAlert.resetValidationError()
    rangeOutput.value = range.value
  }

  range.onchange = () => {
    sweetAlert.resetValidationError()
    range.previousSibling.value = range.value
  }

  select.onchange = () => {
    sweetAlert.resetValidationError()
  }

  checkbox.onchange = () => {
    sweetAlert.resetValidationError()
  }

  textarea.oninput = () => {
    sweetAlert.resetValidationError()
  }

  return modal
}

/*
 * Manipulate DOM
 */
export const elementByClass = (className) => sweetContainer.querySelector('.' + className)

export const getModal = () => document.body.querySelector('.' + swalClasses.modal) || init()

export const getIcons = () => {
  const modal = getModal()
  return modal.querySelectorAll('.' + swalClasses.icon)
}

export const getTitle = () => elementByClass(swalClasses.title)

export const getContent = () => elementByClass(swalClasses.content)

export const getImage = () => elementByClass(swalClasses.image)

export const getSpacer = () => elementByClass(swalClasses.spacer)

export const getProgressSteps = () => elementByClass(swalClasses.progresssteps)

export const getValidationError = () => elementByClass(swalClasses.validationerror)

export const getConfirmButton = () => elementByClass(swalClasses.confirm)

export const getCancelButton = () => elementByClass(swalClasses.cancel)

export const getCloseButton = () => elementByClass(swalClasses.close)

export const getFocusableElements = (focusCancel) => {
  const buttons = [getConfirmButton(), getCancelButton()]
  if (focusCancel) {
    buttons.reverse()
  }
  return buttons.concat(Array.prototype.slice.call(
    getModal().querySelectorAll('button:not([class^=' + swalPrefix + ']), input:not([type=hidden]), textarea, select')
  ))
}

export const hasClass = (elem, className) => {
  if (elem.classList) {
    return elem.classList.contains(className)
  }
  return false
}

export const focusInput = (input) => {
  input.focus()

  // place cursor at end of text in text input
  if (input.type !== 'file') {
    // http://stackoverflow.com/a/2345915/1331425
    const val = input.value
    input.value = ''
    input.value = val
  }
}

export const addClass = (elem, className) => {
  if (!elem || !className) {
    return
  }
  const classes = className.split(/\s+/).filter(Boolean)
  classes.forEach((className) => {
    elem.classList.add(className)
  })
}

export const removeClass = (elem, className) => {
  if (!elem || !className) {
    return
  }
  const classes = className.split(/\s+/).filter(Boolean)
  classes.forEach((className) => {
    elem.classList.remove(className)
  })
}

export const getChildByClass = (elem, className) => {
  for (let i = 0; i < elem.childNodes.length; i++) {
    if (hasClass(elem.childNodes[i], className)) {
      return elem.childNodes[i]
    }
  }
}

export const show = (elem, display) => {
  if (!display) {
    display = 'block'
  }
  elem.style.opacity = ''
  elem.style.display = display
}

export const hide = (elem) => {
  elem.style.opacity = ''
  elem.style.display = 'none'
}

export const empty = (elem) => {
  while (elem.firstChild) {
    elem.removeChild(elem.firstChild)
  }
}

// borrowed from jqeury $(elem).is(':visible') implementation
export const isVisible = (elem) => elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length

export const removeStyleProperty = (elem, property) => {
  if (elem.style.removeProperty) {
    elem.style.removeProperty(property)
  } else {
    elem.style.removeAttribute(property)
  }
}

export const fireClick = (node) => {
  if (!isVisible(node)) {
    return false
  }

  // Taken from http://www.nonobtrusive.com/2011/11/29/programatically-fire-crossbrowser-click-event-with-javascript/
  // Then fixed for today's Chrome browser.
  if (typeof MouseEvent === 'function') {
    // Up-to-date approach
    const mevt = new MouseEvent('click', {
      view: window,
      bubbles: false,
      cancelable: true
    })
    node.dispatchEvent(mevt)
  } else if (document.createEvent) {
    // Fallback
    const evt = document.createEvent('MouseEvents')
    evt.initEvent('click', false, false)
    node.dispatchEvent(evt)
  } else if (document.createEventObject) {
    node.fireEvent('onclick')
  } else if (typeof node.onclick === 'function') {
    node.onclick()
  }
}

export const animationEndEvent = (() => {
  const testEl = document.createElement('div')
  const transEndEventNames = {
    'WebkitAnimation': 'webkitAnimationEnd',
    'OAnimation': 'oAnimationEnd oanimationend',
    'msAnimation': 'MSAnimationEnd',
    'animation': 'animationend'
  }
  for (const i in transEndEventNames) {
    if (transEndEventNames.hasOwnProperty(i) &&
      testEl.style[i] !== undefined) {
      return transEndEventNames[i]
    }
  }

  return false
})()

// Reset the page to its previous state
export const resetPrevState = () => {
  const modal = getModal()
  window.onkeydown = states.previousWindowKeyDown
  if (states.previousActiveElement && states.previousActiveElement.focus) {
    states.previousActiveElement.focus()
  }
  clearTimeout(modal.timeout)
}

// Measure width of scrollbar
// https://github.com/twbs/bootstrap/blob/master/js/modal.js#L279-L286
export const measureScrollbar = () => {
  const scrollDiv = document.createElement('div')
  scrollDiv.style.width = '50px'
  scrollDiv.style.height = '50px'
  scrollDiv.style.overflow = 'scroll'
  document.body.appendChild(scrollDiv)
  const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
  document.body.removeChild(scrollDiv)
  return scrollbarWidth
}

// JavaScript Debounce Function
// Simplivied version of https://davidwalsh.name/javascript-debounce-function
export const debounce = (func, wait) => {
  let timeout
  return () => {
    const later = () => {
      timeout = null
      func()
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}
