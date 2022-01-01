import { getTimerProgressBar, getConfirmButton, getDenyButton, getCancelButton } from './getters.js'
import { swalClasses, iconTypes } from '../classes.js'
import { toArray, warn } from '../utils.js'

// Remember state in cases where opening and handling a modal will fiddle with it.
export const states = {
  previousBodyPadding: null
}

/**
 * Securely set innerHTML of an element
 * https://github.com/sweetalert2/sweetalert2/issues/1926
 *
 * @param {HTMLElement} elem
 * @param {string} html
 */
export const setInnerHtml = (elem, html) => {
  elem.textContent = ''
  if (html) {
    const parser = new DOMParser()
    const parsed = parser.parseFromString(html, `text/html`)
    toArray(parsed.querySelector('head').childNodes).forEach((child) => {
      elem.appendChild(child)
    })
    toArray(parsed.querySelector('body').childNodes).forEach((child) => {
      elem.appendChild(child)
    })
  }
}

/**
 * @param {HTMLElement} elem
 * @param {string} className
 * @returns {boolean}
 */
export const hasClass = (elem, className) => {
  if (!className) {
    return false
  }
  const classList = className.split(/\s+/)
  for (let i = 0; i < classList.length; i++) {
    if (!elem.classList.contains(classList[i])) {
      return false
    }
  }
  return true
}

const removeCustomClasses = (elem, params) => {
  toArray(elem.classList).forEach(className => {
    if (
      !Object.values(swalClasses).includes(className) &&
      !Object.values(iconTypes).includes(className) &&
      !Object.values(params.showClass).includes(className)
    ) {
      elem.classList.remove(className)
    }
  })
}

export const applyCustomClass = (elem, params, className) => {
  removeCustomClasses(elem, params)

  if (params.customClass && params.customClass[className]) {
    if (typeof params.customClass[className] !== 'string' && !params.customClass[className].forEach) {
      return warn(`Invalid type of customClass.${className}! Expected string or iterable object, got "${typeof params.customClass[className]}"`)
    }

    addClass(elem, params.customClass[className])
  }
}

/**
 * @param {HTMLElement} popup
 * @param {string} inputType
 * @returns {HTMLInputElement | null}
 */
export const getInput = (popup, inputType) => {
  if (!inputType) {
    return null
  }
  switch (inputType) {
    case 'select':
    case 'textarea':
    case 'file':
      return popup.querySelector(`.${swalClasses.popup} > .${swalClasses[inputType]}`)
    case 'checkbox':
      return popup.querySelector(`.${swalClasses.popup} > .${swalClasses.checkbox} input`)
    case 'radio':
      return popup.querySelector(`.${swalClasses.popup} > .${swalClasses.radio} input:checked`) ||
        popup.querySelector(`.${swalClasses.popup} > .${swalClasses.radio} input:first-child`)
    case 'range':
      return popup.querySelector(`.${swalClasses.popup} > .${swalClasses.range} input`)
    default:
      return popup.querySelector(`.${swalClasses.popup} > .${swalClasses.input}`)
  }
}

/**
 * @param {HTMLInputElement} input
 */
export const focusInput = (input) => {
  input.focus()

  // place cursor at end of text in text input
  if (input.type !== 'file') {
    // http://stackoverflow.com/a/2345915
    const val = input.value
    input.value = ''
    input.value = val
  }
}

/**
 * @param {HTMLElement | HTMLElement[] | null} target
 * @param {string | string[]} classList
 * @param {boolean} condition
 */
export const toggleClass = (target, classList, condition) => {
  if (!target || !classList) {
    return
  }
  if (typeof classList === 'string') {
    classList = classList.split(/\s+/).filter(Boolean)
  }
  classList.forEach((className) => {
    if (Array.isArray(target)) {
      target.forEach((elem) => {
        condition ? elem.classList.add(className) : elem.classList.remove(className)
      })
    } else {
      condition ? target.classList.add(className) : target.classList.remove(className)
    }
  })
}

/**
 * @param {HTMLElement | HTMLElement[] | null} target
 * @param {string | string[]} classList
 */
export const addClass = (target, classList) => {
  toggleClass(target, classList, true)
}

/**
 * @param {HTMLElement | HTMLElement[] | null} target
 * @param {string | string[]} classList
 */
export const removeClass = (target, classList) => {
  toggleClass(target, classList, false)
}

/**
 * Get direct child of an element by class name
 *
 * @param {HTMLElement} elem
 * @param {string} className
 * @returns {HTMLElement | null}
 */
export const getDirectChildByClass = (elem, className) => {
  const childNodes = toArray(elem.childNodes)
  for (let i = 0; i < childNodes.length; i++) {
    if (hasClass(childNodes[i], className)) {
      return childNodes[i]
    }
  }
}

/**
 * @param {HTMLElement} elem
 * @param {string} property
 * @param {*} value
 */
export const applyNumericalStyle = (elem, property, value) => {
  if (value === `${parseInt(value)}`) {
    value = parseInt(value)
  }
  if (value || parseInt(value) === 0) {
    elem.style[property] = (typeof value === 'number') ? `${value}px` : value
  } else {
    elem.style.removeProperty(property)
  }
}

/**
 * @param {HTMLElement} elem
 * @param {string} display
 */
export const show = (elem, display = 'flex') => {
  elem.style.display = display
}

/**
 * @param {HTMLElement} elem
 */
export const hide = (elem) => {
  elem.style.display = 'none'
}

export const setStyle = (parent, selector, property, value) => {
  const el = parent.querySelector(selector)
  if (el) {
    el.style[property] = value
  }
}

export const toggle = (elem, condition, display) => {
  condition ? show(elem, display) : hide(elem)
}

// borrowed from jquery $(elem).is(':visible') implementation
export const isVisible = (elem) => !!(elem && (elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length))

export const allButtonsAreHidden = () => !isVisible(getConfirmButton()) && !isVisible(getDenyButton()) && !isVisible(getCancelButton())

export const isScrollable = (elem) => !!(elem.scrollHeight > elem.clientHeight)

// borrowed from https://stackoverflow.com/a/46352119
export const hasCssAnimation = (elem) => {
  const style = window.getComputedStyle(elem)

  const animDuration = parseFloat(style.getPropertyValue('animation-duration') || '0')
  const transDuration = parseFloat(style.getPropertyValue('transition-duration') || '0')

  return animDuration > 0 || transDuration > 0
}

export const animateTimerProgressBar = (timer, reset = false) => {
  const timerProgressBar = getTimerProgressBar()
  if (isVisible(timerProgressBar)) {
    if (reset) {
      timerProgressBar.style.transition = 'none'
      timerProgressBar.style.width = '100%'
    }
    setTimeout(() => {
      timerProgressBar.style.transition = `width ${timer / 1000}s linear`
      timerProgressBar.style.width = '0%'
    }, 10)
  }
}

export const stopTimerProgressBar = () => {
  const timerProgressBar = getTimerProgressBar()
  const timerProgressBarWidth = parseInt(window.getComputedStyle(timerProgressBar).width)
  timerProgressBar.style.removeProperty('transition')
  timerProgressBar.style.width = '100%'
  const timerProgressBarFullWidth = parseInt(window.getComputedStyle(timerProgressBar).width)
  const timerProgressBarPercent = timerProgressBarWidth / timerProgressBarFullWidth * 100
  timerProgressBar.style.removeProperty('transition')
  timerProgressBar.style.width = `${timerProgressBarPercent}%`
}
