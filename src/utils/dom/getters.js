import { swalClasses } from '../classes.js'
import { uniqueArray, toArray } from '../utils.js'
import { isVisible } from './domUtils.js'

export const getContainer = () => document.body.querySelector(`.${swalClasses.container}`)

export const elementBySelector = (selectorString) => {
  const container = getContainer()
  return container ? container.querySelector(selectorString) : null
}

const elementByClass = (className) => {
  return elementBySelector(`.${className}`)
}

export const getPopup = () => elementByClass(swalClasses.popup)

export const getIcons = () => {
  const popup = getPopup()
  return toArray(popup.querySelectorAll(`.${swalClasses.icon}`))
}

export const getIcon = () => {
  const visibleIcon = getIcons().filter((icon) => isVisible(icon))
  return visibleIcon.length ? visibleIcon[0] : null
}

export const getTitle = () => elementByClass(swalClasses.title)

export const getContent = () => elementByClass(swalClasses.content)

export const getHtmlContainer = () => elementByClass(swalClasses['html-container'])

export const getImage = () => elementByClass(swalClasses.image)

export const getProgressSteps = () => elementByClass(swalClasses['progress-steps'])

export const getValidationMessage = () => elementByClass(swalClasses['validation-message'])

export const getConfirmButton = () => elementBySelector(`.${swalClasses.actions} .${swalClasses.confirm}`)

export const getCancelButton = () => elementBySelector(`.${swalClasses.actions} .${swalClasses.cancel}`)

export const getActions = () => elementByClass(swalClasses.actions)

export const getHeader = () => elementByClass(swalClasses.header)

export const getFooter = () => elementByClass(swalClasses.footer)

export const getTimerProgressBar = () => elementByClass(swalClasses['timer-progress-bar'])

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

export const getFocusableElements = () => {
  const focusableElementsWithTabindex = toArray(
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

  const otherFocusableElements = toArray(
    getPopup().querySelectorAll(focusable)
  ).filter(el => el.getAttribute('tabindex') !== '-1')

  return uniqueArray(focusableElementsWithTabindex.concat(otherFocusableElements)).filter(el => isVisible(el))
}

export const isModal = () => {
  return !isToast() && !document.body.classList.contains(swalClasses['no-backdrop'])
}

export const isToast = () => {
  return document.body.classList.contains(swalClasses['toast-shown'])
}

export const isLoading = () => {
  return getPopup().hasAttribute('data-loading')
}
