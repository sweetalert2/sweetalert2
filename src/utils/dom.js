import { default as sweetAlert } from '../sweetalert2.js'
import { swalClasses, iconTypes } from './classes.js'
import { uniqueArray, error } from './utils.js'

// Remember state in cases where opening and handling a modal will fiddle with it.
export const states = {
  previousActiveElement: null,
  previousBodyPadding: null
}

// Detect Node env
export const isNodeEnv = () => typeof window === 'undefined' || typeof document === 'undefined'

/*
 * Add modal + overlay to DOM
 */
export const init = (params) => {
  // Clean up the old popup if it exists
  const c = getContainer()
  if (c) {
    c.parentNode.removeChild(c)
    removeClass(
      [document.documentElement, document.body],
      [
        swalClasses['no-backdrop'],
        swalClasses['has-input'],
        swalClasses['toast-shown']
      ]
    )
  }

  if (isNodeEnv()) {
    error('SweetAlert2 requires document to initialize')
    return
  }

  const container = document.createElement('div')
  container.className = swalClasses.container
  container.innerHTML = sweetHTML

  let targetElement = typeof params.target === 'string' ? document.querySelector(params.target) : params.target
  targetElement.appendChild(container)

  const popup = getPopup()
  const input = getChildByClass(popup, swalClasses.input)
  const file = getChildByClass(popup, swalClasses.file)
  const range = popup.querySelector(`.${swalClasses.range} input`)
  const rangeOutput = popup.querySelector(`.${swalClasses.range} output`)
  const select = getChildByClass(popup, swalClasses.select)
  const checkbox = popup.querySelector(`.${swalClasses.checkbox} input`)
  const textarea = getChildByClass(popup, swalClasses.textarea)

  // a11y
  popup.setAttribute('aria-live', params.toast ? 'polite' : 'assertive')

  const resetValidationError = () => {
    sweetAlert.isVisible() && sweetAlert.resetValidationError()
  }

  input.oninput = resetValidationError
  file.onchange = resetValidationError
  select.onchange = resetValidationError
  checkbox.onchange = resetValidationError
  textarea.oninput = resetValidationError

  range.oninput = () => {
    resetValidationError()
    rangeOutput.value = range.value
  }

  range.onchange = () => {
    resetValidationError()
    range.previousSibling.value = range.value
  }

  return popup
}

/*
 * Manipulate DOM
 */

const sweetHTML = `
 <div role="dialog" aria-modal="true" aria-labelledby="${swalClasses.title}" aria-describedby="${swalClasses.content}" class="${swalClasses.popup}" tabindex="-1">
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
   <img class="${swalClasses.image}" />
   <div class="${swalClasses.contentwrapper}">
   <h2 class="${swalClasses.title}" id="${swalClasses.title}"></h2>
   <div id="${swalClasses.content}" class="${swalClasses.content}"></div>
   </div>
   <input class="${swalClasses.input}" />
   <input type="file" class="${swalClasses.file}" />
   <div class="${swalClasses.range}">
     <output></output>
     <input type="range" />
   </div>
   <select class="${swalClasses.select}"></select>
   <div class="${swalClasses.radio}"></div>
   <label for="${swalClasses.checkbox}" class="${swalClasses.checkbox}">
     <input type="checkbox" />
   </label>
   <textarea class="${swalClasses.textarea}"></textarea>
   <div class="${swalClasses.validationerror}" id="${swalClasses.validationerror}"></div>
   <div class="${swalClasses.buttonswrapper}">
     <button type="button" class="${swalClasses.confirm}">OK</button>
     <button type="button" class="${swalClasses.cancel}">Cancel</button>
   </div>
   <button type="button" class="${swalClasses.close}">×</button>
 </div>
`.replace(/(^|\n)\s*/g, '')

export const getContainer = () => document.body.querySelector('.' + swalClasses.container)

export const getPopup = () => getContainer() ? getContainer().querySelector('.' + swalClasses.popup) : null

export const getIcons = () => {
  const popup = getPopup()
  return popup.querySelectorAll('.' + swalClasses.icon)
}

export const elementByClass = (className) => getContainer() ? getContainer().querySelector('.' + className) : null

export const getTitle = () => elementByClass(swalClasses.title)

export const getContent = () => elementByClass(swalClasses.content)

export const getImage = () => elementByClass(swalClasses.image)

export const getProgressSteps = () => elementByClass(swalClasses.progresssteps)

export const getValidationError = () => elementByClass(swalClasses.validationerror)

export const getConfirmButton = () => elementByClass(swalClasses.confirm)

export const getCancelButton = () => elementByClass(swalClasses.cancel)

export const getButtonsWrapper = () => elementByClass(swalClasses.buttonswrapper)

export const getCloseButton = () => elementByClass(swalClasses.close)

export const getFocusableElements = () => {
  const focusableElementsWithTabindex = Array.from(
    getPopup().querySelectorAll('[tabindex]:not([tabindex="-1"]):not([tabindex="0"])')
  )
  // sort according to tabindex
  .sort((a, b) => {
    a = parseInt(a.getAttribute('tabindex'))
    b = parseInt(b.getAttribute('tabindex'))
    if (a > b) {
      return 1
    } else if (a < b) {
      return -1
    }
    return 0
  })

  const otherFocusableElements = Array.prototype.slice.call(
    getPopup().querySelectorAll('button, input:not([type=hidden]), textarea, select, a, [tabindex="0"]')
  )

  return uniqueArray(focusableElementsWithTabindex.concat(otherFocusableElements))
}

export const isModal = () => {
  return !document.body.classList.contains(swalClasses['toast-shown'])
}

export const isToast = () => {
  return document.body.classList.contains(swalClasses['toast-shown'])
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

const addOrRemoveClass = (target, classList, add) => {
  if (!target || !classList) {
    return
  }
  if (typeof classList === 'string') {
    classList = classList.split(/\s+/).filter(Boolean)
  }
  classList.forEach((className) => {
    if (target.forEach) {
      target.forEach((elem) => {
        add ? elem.classList.add(className) : elem.classList.remove(className)
      })
    } else {
      add ? target.classList.add(className) : target.classList.remove(className)
    }
  })
}

export const addClass = (target, classList) => {
  addOrRemoveClass(target, classList, true)
}

export const removeClass = (target, classList) => {
  addOrRemoveClass(target, classList, false)
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
    display = (elem === getPopup() || elem === getButtonsWrapper()) ? 'flex' : 'block'
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

// borrowed from jquery $(elem).is(':visible') implementation
export const isVisible = (elem) => elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length

export const removeStyleProperty = (elem, property) => {
  if (elem.style.removeProperty) {
    elem.style.removeProperty(property)
  } else {
    elem.style.removeAttribute(property)
  }
}

export const animationEndEvent = (() => {
  // Prevent run in Node env
  if (isNodeEnv()) {
    return false
  }

  const testEl = document.createElement('div')
  const transEndEventNames = {
    'WebkitAnimation': 'webkitAnimationEnd',
    'OAnimation': 'oAnimationEnd oanimationend',
    'animation': 'animationend'
  }
  for (const i in transEndEventNames) {
    if (transEndEventNames.hasOwnProperty(i) && typeof testEl.style[i] !== 'undefined') {
      return transEndEventNames[i]
    }
  }

  return false
})()

// Reset previous window keydown handler and focued element
export const resetPrevState = () => {
  if (states.previousActiveElement && states.previousActiveElement.focus) {
    let x = window.scrollX
    let y = window.scrollY
    states.previousActiveElement.focus()
    if (typeof x !== 'undefined' && typeof y !== 'undefined') { // IE doesn't have scrollX/scrollY support
      window.scrollTo(x, y)
    }
  }
}

// Measure width of scrollbar
// https://github.com/twbs/bootstrap/blob/master/js/modal.js#L279-L286
export const measureScrollbar = () => {
  const supportsTouch = 'ontouchstart' in window || navigator.msMaxTouchPoints
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

/**
 * Inject a string of CSS into the page header
 *
 * @param {String} css
 */
export const injectCSS = (css = '') => {
  // Prevent run in Node env
  if (isNodeEnv()) {
    return false
  }

  let head = document.head || document.getElementsByTagName('head')[0]
  let style = document.createElement('style')
  style.type = 'text/css'
  head.appendChild(style)

  if (style.styleSheet) {
    style.styleSheet.cssText = css
  } else {
    style.appendChild(document.createTextNode(css))
  }
}
