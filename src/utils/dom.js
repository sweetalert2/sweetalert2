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
export const init = function () {
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
  const range = modal.querySelector('.' + swalClasses.range + ' input')
  const select = getChildByClass(modal, swalClasses.select)
  const checkbox = modal.querySelector('.' + swalClasses.checkbox + ' input')
  const textarea = getChildByClass(modal, swalClasses.textarea)

  input.oninput = function () {
    sweetAlert.resetValidationError()
  }

  input.onkeydown = function (event) {
    setTimeout(function () {
      if (event.keyCode === 13) {
        event.stopPropagation()
        sweetAlert.clickConfirm()
      }
    }, 0)
  }

  file.onchange = function () {
    sweetAlert.resetValidationError()
  }

  range.oninput = function () {
    sweetAlert.resetValidationError()
    range.previousSibling.value = range.value
  }

  range.onchange = function () {
    sweetAlert.resetValidationError()
    range.previousSibling.value = range.value
  }

  select.onchange = function () {
    sweetAlert.resetValidationError()
  }

  checkbox.onchange = function () {
    sweetAlert.resetValidationError()
  }

  textarea.oninput = function () {
    sweetAlert.resetValidationError()
  }

  return modal
}

/*
 * Manipulate DOM
 */
export const elementByClass = function (className) {
  return sweetContainer.querySelector('.' + className)
}

export const getModal = function () {
  return document.body.querySelector('.' + swalClasses.modal) || init()
}

export const getIcons = function () {
  const modal = getModal()
  return modal.querySelectorAll('.' + swalClasses.icon)
}

export const getSpacer = function () {
  return elementByClass(swalClasses.spacer)
}

export const getProgressSteps = function () {
  return elementByClass(swalClasses.progresssteps)
}

export const getValidationError = function () {
  return elementByClass(swalClasses.validationerror)
}

export const getConfirmButton = function () {
  return elementByClass(swalClasses.confirm)
}

export const getCancelButton = function () {
  return elementByClass(swalClasses.cancel)
}

export const getCloseButton = function () {
  return elementByClass(swalClasses.close)
}

export const getFocusableElements = function (focusCancel) {
  const buttons = [getConfirmButton(), getCancelButton()]
  if (focusCancel) {
    buttons.reverse()
  }
  return buttons.concat(Array.prototype.slice.call(
    getModal().querySelectorAll('button:not([class^=' + swalPrefix + ']), input:not([type=hidden]), textarea, select')
  ))
}

export const hasClass = function (elem, className) {
  if (elem.classList) {
    return elem.classList.contains(className)
  }
  return false
}

export const focusInput = function (input) {
  input.focus()

  // place cursor at end of text in text input
  if (input.type !== 'file') {
    // http://stackoverflow.com/a/2345915/1331425
    const val = input.value
    input.value = ''
    input.value = val
  }
}

export const addClass = function (elem, className) {
  if (!elem || !className) {
    return
  }
  const classes = className.split(/\s+/)
  classes.forEach(function (className) {
    elem.classList.add(className)
  })
}

export const removeClass = function (elem, className) {
  if (!elem || !className) {
    return
  }
  const classes = className.split(/\s+/)
  classes.forEach(function (className) {
    elem.classList.remove(className)
  })
}

export const getChildByClass = function (elem, className) {
  for (let i = 0; i < elem.childNodes.length; i++) {
    if (hasClass(elem.childNodes[i], className)) {
      return elem.childNodes[i]
    }
  }
}

export const show = function (elem, display) {
  if (!display) {
    display = 'block'
  }
  elem.style.opacity = ''
  elem.style.display = display
}

export const hide = function (elem) {
  elem.style.opacity = ''
  elem.style.display = 'none'
}

export const empty = function (elem) {
  while (elem.firstChild) {
    elem.removeChild(elem.firstChild)
  }
}

// borrowed from jqeury $(elem).is(':visible') implementation
export const isVisible = function (elem) {
  return elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length
}

export const removeStyleProperty = function (elem, property) {
  if (elem.style.removeProperty) {
    elem.style.removeProperty(property)
  } else {
    elem.style.removeAttribute(property)
  }
}

export const getTopMargin = function (elem) {
  const elemDisplay = elem.style.display
  elem.style.left = '-9999px'
  elem.style.display = 'block'

  const height = elem.clientHeight

  elem.style.left = ''
  elem.style.display = elemDisplay
  return ('-' + parseInt(height / 2, 10) + 'px')
}

export const fadeIn = function (elem, interval) {
  if (+elem.style.opacity < 1) {
    interval = interval || 16
    elem.style.opacity = 0
    elem.style.display = 'block'
    let last = +new Date()
    const tick = function () {
      const newOpacity = +elem.style.opacity + (new Date() - last) / 100
      elem.style.opacity = (newOpacity > 1) ? 1 : newOpacity
      last = +new Date()

      if (+elem.style.opacity < 1) {
        setTimeout(tick, interval)
      }
    }
    tick()
  }
}

export const fadeOut = function (elem, interval) {
  if (+elem.style.opacity > 0) {
    interval = interval || 16
    const opacity = elem.style.opacity
    let last = +new Date()
    const tick = function () {
      const change = new Date() - last
      const newOpacity = +elem.style.opacity - change / (opacity * 100)
      elem.style.opacity = newOpacity
      last = +new Date()

      if (+elem.style.opacity > 0) {
        setTimeout(tick, interval)
      } else {
        hide(elem)
      }
    }
    tick()
  }
}

export const fireClick = function (node) {
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

export const stopEventPropagation = function (e) {
  // In particular, make sure the space bar doesn't scroll the main window.
  if (typeof e.stopPropagation === 'function') {
    e.stopPropagation()
    e.preventDefault()
  } else if (window.event && window.event.hasOwnProperty('cancelBubble')) {
    window.event.cancelBubble = true
  }
}

export const animationEndEvent = (function () {
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
export const resetPrevState = function () {
  const modal = getModal()
  window.onkeydown = states.previousWindowKeyDown
  if (states.previousActiveElement && states.previousActiveElement.focus) {
    states.previousActiveElement.focus()
  }
  clearTimeout(modal.timeout)
}

// Measure width of scrollbar
// https://github.com/twbs/bootstrap/blob/master/js/modal.js#L279-L286
export const measureScrollbar = function () {
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
// https://davidwalsh.name/javascript-debounce-function
export const debounce = function (func, wait, immediate) {
  let timeout
  return function () {
    const context = this
    const args = arguments
    const later = function () {
      timeout = null
      if (!immediate) func.apply(context, args)
    }
    const callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) func.apply(context, args)
  }
}
