import globalState from '../globalState.js'
import { setAriaHidden } from './aria.js'
import { swalClasses } from './classes.js'
import * as dom from './dom/index.js'
import { iOSfix } from './iosFix.js'
import { replaceScrollbarWithPadding } from './scrollbar.js'

export const SHOW_CLASS_TIMEOUT = 10

/**
 * Open popup, add necessary classes and styles, fix scrollbar
 *
 * @param {SweetAlertOptions} params
 */
export const openPopup = (params) => {
  const container = dom.getContainer()
  const popup = dom.getPopup()

  if (!container || !popup) {
    return
  }

  if (typeof params.willOpen === 'function') {
    params.willOpen(popup)
  }
  globalState.eventEmitter?.emit('willOpen', popup)

  const bodyStyles = window.getComputedStyle(document.body)
  const initialBodyOverflow = bodyStyles.overflowY
  addClasses(container, popup, params)

  // scrolling is 'hidden' until animation is done, after that 'auto'
  setTimeout(() => {
    setScrollingVisibility(container, popup)
  }, SHOW_CLASS_TIMEOUT)

  if (dom.isModal()) {
    // Using ternary instead of ?? operator for Webpack 4 compatibility
    fixScrollContainer(
      container,
      params.scrollbarPadding !== undefined ? params.scrollbarPadding : false,
      initialBodyOverflow
    )
    setAriaHidden()
  }

  if (!dom.isToast() && !globalState.previousActiveElement) {
    globalState.previousActiveElement = document.activeElement
  }

  if (typeof params.didOpen === 'function') {
    const didOpen = params.didOpen
    setTimeout(() => didOpen(popup))
  }
  globalState.eventEmitter?.emit('didOpen', popup)
}

/**
 * @param {Event} event
 */
const swalOpenAnimationFinished = (event) => {
  const popup = dom.getPopup()
  if (!popup || event.target !== popup) {
    return
  }
  const container = dom.getContainer()
  if (!container) {
    return
  }
  popup.removeEventListener('animationend', swalOpenAnimationFinished)
  popup.removeEventListener('transitionend', swalOpenAnimationFinished)
  enableScrolling(container, popup)

  // no-transition is added in init() in case one swal is opened right after another
  dom.removeClass(container, swalClasses['no-transition'])
}

/**
 * @param {HTMLElement} container
 * @param {HTMLElement} popup
 */
const setScrollingVisibility = (container, popup) => {
  if (dom.hasCssAnimation(popup)) {
    container.style.overflowY = 'hidden'
    popup.addEventListener('animationend', swalOpenAnimationFinished)
    popup.addEventListener('transitionend', swalOpenAnimationFinished)
  } else {
    enableScrolling(container, popup)
  }
}

/**
 * In no-backdrop mode, the container has pointer-events: none to allow
 * clicking through to the page. WebKit bug #183870 prevents scrolling
 * on such elements, so we make the popup itself scrollable instead.
 * https://bugs.webkit.org/show_bug.cgi?id=183870
 *
 * @param {HTMLElement} container
 * @param {HTMLElement} popup
 */
const enableScrolling = (container, popup) => {
  if (dom.hasClass(document.body, swalClasses['no-backdrop'])) {
    const containerStyle = window.getComputedStyle(container)
    const verticalPadding = (parseFloat(containerStyle.paddingTop) || 0) + (parseFloat(containerStyle.paddingBottom) || 0)
    popup.style.maxHeight = `calc(100vh - ${verticalPadding}px)`
    popup.style.overflowY = 'auto'
  } else {
    container.style.overflowY = 'auto'
  }
}

/**
 * @param {HTMLElement} container
 * @param {boolean} scrollbarPadding
 * @param {string} initialBodyOverflow
 */
const fixScrollContainer = (container, scrollbarPadding, initialBodyOverflow) => {
  iOSfix()

  if (scrollbarPadding && initialBodyOverflow !== 'hidden') {
    replaceScrollbarWithPadding(initialBodyOverflow)
  }

  // sweetalert2/issues/1247
  setTimeout(() => {
    container.scrollTop = 0
  })
}

/**
 * @param {HTMLElement} container
 * @param {HTMLElement} popup
 * @param {SweetAlertOptions} params
 */
const addClasses = (container, popup, params) => {
  if (params.showClass?.backdrop) {
    dom.addClass(container, params.showClass.backdrop)
  }
  if (params.animation) {
    // this workaround with opacity is needed for https://github.com/sweetalert2/sweetalert2/issues/2059
    popup.style.setProperty('opacity', '0', 'important')
    dom.show(popup, 'grid')
    setTimeout(() => {
      // Animate popup right after showing it
      if (params.showClass?.popup) {
        dom.addClass(popup, params.showClass.popup)
      }
      // and remove the opacity workaround
      popup.style.removeProperty('opacity')
    }, SHOW_CLASS_TIMEOUT) // 10ms in order to fix #2062
  } else {
    dom.show(popup, 'grid')
  }

  dom.addClass([document.documentElement, document.body], swalClasses.shown)
  if (params.heightAuto && params.backdrop && !params.toast) {
    dom.addClass([document.documentElement, document.body], swalClasses['height-auto'])
  }
}
