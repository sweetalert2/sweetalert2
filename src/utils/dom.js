/* global MouseEvent */

import { default as sweetAlert } from '../sweetalert2.js'
import { swalClasses, iconTypes } from './classes.js'
import { uniqueArray } from './utils.js'

// Remember state in cases where opening and handling a modal will fiddle with it.
export const states = {
  previousWindowKeyDown: null,
  previousActiveElement: null,
  previousBodyPadding: null
}

/*
 * Add modal + overlay to DOM
 */
export const init = (params) => {
  if (typeof document === 'undefined') {
    console.error('SweetAlert2 requires document to initialize')
    return
  }

  const container = document.createElement('div')
  container.className = swalClasses.container
  container.innerHTML = sweetHTML

  let targetElement = document.querySelector(params.target)
  if (!targetElement) {
    console.warn(`SweetAlert2: Can't find the target "${params.target}"`)
    targetElement = document.body
  }
  targetElement.appendChild(container)

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
      if (event.keyCode === 13 && params.allowEnterKey) {
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

const sweetHTML = `
 <div role="dialog" aria-labelledby="${swalClasses.title}" aria-describedby="${swalClasses.content}" class="${swalClasses.modal}" tabindex="-1">
   <ul class="${swalClasses.progresssteps}"></ul>
   <div class="${swalClasses.icon} ${iconTypes.error}">
     <span class="swal2-x-mark"><span class="swal2-x-mark-line-left"></span><span class="swal2-x-mark-line-right"></span></span>
   </div>
   <div class="${swalClasses.icon} ${iconTypes.question}">?</div>
   <div class="${swalClasses.icon} ${iconTypes.warning}">!</div>
   <div class="${swalClasses.icon} ${iconTypes.info}">i</div>
   <div class="${swalClasses.icon} ${iconTypes.success}">
     <div class="swal2-success-circular-line-left"></div>
     <span class="swal2-success-line-tip"></span> <span class="swal2-success-line-long"></span>
     <div class="swal2-success-ring"></div> <div class="swal2-success-fix"></div>
     <div class="swal2-success-circular-line-right"></div>
   </div>
   <img class="${swalClasses.image}">
   <h2 class="${swalClasses.title}" id="${swalClasses.title}"></h2>
   <div id="${swalClasses.content}" class="${swalClasses.content}"></div>
   <input class="${swalClasses.input}">
   <input type="file" class="${swalClasses.file}">
   <div class="${swalClasses.range}">
     <output></output>
     <input type="range">
   </div>
   <select class="${swalClasses.select}"></select>
   <div class="${swalClasses.radio}"></div>
   <label for="${swalClasses.checkbox}" class="${swalClasses.checkbox}">
     <input type="checkbox">
   </label>
   <textarea class="${swalClasses.textarea}"></textarea>
   <div class="${swalClasses.validationerror}"></div>
   <div class="${swalClasses.buttonswrapper}">
     <button type="button" class="${swalClasses.confirm}">OK</button>
     <button type="button" class="${swalClasses.cancel}">Cancel</button>
   </div>
   <button type="button" class="${swalClasses.close}" aria-label="Close this dialog">&times;</button>
 </div>
`.replace(/(^|\n)\s*/g, '')

export const getContainer = () => document.body.querySelector('.' + swalClasses.container)

export const getModal = () => getContainer() ? getContainer().querySelector('.' + swalClasses.modal) : null

export const getIcons = () => {
  const modal = getModal()
  return modal.querySelectorAll('.' + swalClasses.icon)
}

export const elementByClass = (className) => getContainer() ? getContainer().querySelector('.' + className) : null

export const getTitle = () => elementByClass(swalClasses.title)

export const getContent = () => elementByClass(swalClasses.content)

export const getImage = () => elementByClass(swalClasses.image)

export const getButtonsWrapper = () => elementByClass(swalClasses.buttonswrapper)

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
  const focusableElements = buttons.concat(Array.prototype.slice.call(
    getModal().querySelectorAll('button, input:not([type=hidden]), textarea, select, a, *[tabindex]:not([tabindex="-1"])')
  ))
  return uniqueArray(focusableElements)
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

// Reset previous window keydown handler and focued element
export const resetPrevState = () => {
  window.onkeydown = states.previousWindowKeyDown
  if (states.previousActiveElement && states.previousActiveElement.focus) {
    let x = window.scrollX
    let y = window.scrollY
    states.previousActiveElement.focus()
    if (x && y) { // IE has no scrollX/scrollY support
      window.scrollTo(x, y)
    }
  }
}

// Measure width of scrollbar
// https://github.com/twbs/bootstrap/blob/master/js/modal.js#L279-L286
export const measureScrollbar = () => {
  var supportsTouch = 'ontouchstart' in window || navigator.msMaxTouchPoints
  if (supportsTouch) {
    return 0
  }
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
