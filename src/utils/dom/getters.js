import { swalClasses } from '../classes.js'
import { hasClass, isVisible } from './domUtils.js'

/**
 * Gets the popup container which contains the backdrop and the popup itself.
 *
 * @returns {HTMLElement | null}
 */
export const getContainer = () => document.body.querySelector(`.${swalClasses.container}`)

/**
 * @param {string} selectorString
 * @returns {HTMLElement | null}
 */
export const elementBySelector = (selectorString) => {
  const container = getContainer()
  return container ? container.querySelector(selectorString) : null
}

/**
 * @param {string} className
 * @returns {HTMLElement | null}
 */
const elementByClass = (className) => {
  return elementBySelector(`.${className}`)
}

/**
 * @returns {HTMLElement | null}
 */
export const getPopup = () => elementByClass(swalClasses.popup)

/**
 * @returns {HTMLElement | null}
 */
export const getIcon = () => elementByClass(swalClasses.icon)

/**
 * @returns {HTMLElement | null}
 */
export const getIconContent = () => elementByClass(swalClasses['icon-content'])

/**
 * @returns {HTMLElement | null}
 */
export const getTitle = () => elementByClass(swalClasses.title)

/**
 * @returns {HTMLElement | null}
 */
export const getHtmlContainer = () => elementByClass(swalClasses['html-container'])

/**
 * @returns {HTMLElement | null}
 */
export const getImage = () => elementByClass(swalClasses.image)

/**
 * @returns {HTMLElement | null}
 */
export const getProgressSteps = () => elementByClass(swalClasses['progress-steps'])

/**
 * @returns {HTMLElement | null}
 */
export const getValidationMessage = () => elementByClass(swalClasses['validation-message'])

/**
 * @returns {HTMLButtonElement | null}
 */
export const getConfirmButton = () =>
  /** @type {HTMLButtonElement} */ (elementBySelector(`.${swalClasses.actions} .${swalClasses.confirm}`))

/**
 * @returns {HTMLButtonElement | null}
 */
export const getCancelButton = () =>
  /** @type {HTMLButtonElement} */ (elementBySelector(`.${swalClasses.actions} .${swalClasses.cancel}`))

/**
 * @returns {HTMLButtonElement | null}
 */
export const getDenyButton = () =>
  /** @type {HTMLButtonElement} */ (elementBySelector(`.${swalClasses.actions} .${swalClasses.deny}`))

/**
 * @returns {HTMLElement | null}
 */
export const getInputLabel = () => elementByClass(swalClasses['input-label'])

/**
 * @returns {HTMLElement | null}
 */
export const getLoader = () => elementBySelector(`.${swalClasses.loader}`)

/**
 * @returns {HTMLElement | null}
 */
export const getActions = () => elementByClass(swalClasses.actions)

/**
 * @returns {HTMLElement | null}
 */
export const getFooter = () => elementByClass(swalClasses.footer)

/**
 * @returns {HTMLElement | null}
 */
export const getTimerProgressBar = () => elementByClass(swalClasses['timer-progress-bar'])

/**
 * @returns {HTMLElement | null}
 */
export const getCloseButton = () => elementByClass(swalClasses.close)

// https://github.com/jkup/focusable/blob/master/index.js
const focusable = `
  a[href],
  area[href],
  input:not([disabled]),
  select:not([disabled]),
  textarea:not([disabled]),
  button:not([disabled]),
  iframe,
  object,
  embed,
  [tabindex="0"],
  [contenteditable],
  audio[controls],
  video[controls],
  summary
`
/**
 * @returns {HTMLElement[]}
 */
export const getFocusableElements = () => {
  const popup = getPopup()
  if (!popup) {
    return []
  }
  /** @type {NodeListOf<HTMLElement>} */
  const focusableElementsWithTabindex = popup.querySelectorAll('[tabindex]:not([tabindex="-1"]):not([tabindex="0"])')
  const focusableElementsWithTabindexSorted = Array.from(focusableElementsWithTabindex)
    // sort according to tabindex
    .sort((a, b) => {
      const tabindexA = parseInt(a.getAttribute('tabindex') || '0')
      const tabindexB = parseInt(b.getAttribute('tabindex') || '0')
      if (tabindexA > tabindexB) {
        return 1
      } else if (tabindexA < tabindexB) {
        return -1
      }
      return 0
    })

  /** @type {NodeListOf<HTMLElement>} */
  const otherFocusableElements = popup.querySelectorAll(focusable)
  const otherFocusableElementsFiltered = Array.from(otherFocusableElements).filter(
    (el) => el.getAttribute('tabindex') !== '-1'
  )

  return [...new Set(focusableElementsWithTabindexSorted.concat(otherFocusableElementsFiltered))].filter((el) =>
    isVisible(el)
  )
}

/**
 * @returns {boolean}
 */
export const isModal = () => {
  return (
    hasClass(document.body, swalClasses.shown) &&
    !hasClass(document.body, swalClasses['toast-shown']) &&
    !hasClass(document.body, swalClasses['no-backdrop'])
  )
}

/**
 * @returns {boolean}
 */
export const isToast = () => {
  const popup = getPopup()
  if (!popup) {
    return false
  }
  return hasClass(popup, swalClasses.toast)
}

/**
 * @returns {boolean}
 */
export const isLoading = () => {
  const popup = getPopup()
  if (!popup) {
    return false
  }
  return popup.hasAttribute('data-loading')
}
