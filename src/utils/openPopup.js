import * as dom from './dom/index.js'
import { swalClasses } from './classes.js'
import { fixScrollbar } from './scrollbarFix.js'
import { iOSfix } from './iosFix.js'
import { IEfix } from './ieFix.js'
import { setAriaHidden } from './aria.js'
import globalState from '../globalState.js'

/**
 * Open popup, add necessary classes and styles, fix scrollbar
 *
 * @param params
 */
export const openPopup = (params) => {
  const container = dom.getContainer()
  const popup = dom.getPopup()

  if (typeof params.willOpen === 'function') {
    params.willOpen(popup)
  } else if (typeof params.onBeforeOpen === 'function') {
    params.onBeforeOpen(popup) // @deprecated
  }

  const bodyStyles = window.getComputedStyle(document.body)
  const initialBodyOverflow = bodyStyles.overflowY
  addClasses(container, popup, params)

  // scrolling is 'hidden' until animation is done, after that 'auto'
  setScrollingVisibility(container, popup)

  if (dom.isModal()) {
    fixScrollContainer(container, params.scrollbarPadding, initialBodyOverflow)
    setAriaHidden()
  }

  if (!dom.isToast() && !globalState.previousActiveElement) {
    globalState.previousActiveElement = document.activeElement
  }

  runDidOpen(popup, params)

  dom.removeClass(container, swalClasses['no-transition'])
}

const runDidOpen = (popup, params) => {
  if (typeof params.didOpen === 'function') {
    setTimeout(() => params.didOpen(popup))
  } else if (typeof params.onOpen === 'function') {
    setTimeout(() => params.onOpen(popup)) // @deprecated
  }
}

const swalOpenAnimationFinished = (event) => {
  const popup = dom.getPopup()
  if (event.target !== popup) {
    return
  }
  const container = dom.getContainer()
  popup.removeEventListener(dom.animationEndEvent, swalOpenAnimationFinished)
  container.style.overflowY = 'auto'
}

const setScrollingVisibility = (container, popup) => {
  if (dom.animationEndEvent && dom.hasCssAnimation(popup)) {
    container.style.overflowY = 'hidden'
    popup.addEventListener(dom.animationEndEvent, swalOpenAnimationFinished)
  } else {
    container.style.overflowY = 'auto'
  }
}

const fixScrollContainer = (container, scrollbarPadding, initialBodyOverflow) => {
  iOSfix()
  IEfix()

  if (scrollbarPadding && initialBodyOverflow !== 'hidden') {
    fixScrollbar()
  }

  // sweetalert2/issues/1247
  setTimeout(() => {
    container.scrollTop = 0
  })
}

const addClasses = (container, popup, params) => {
  dom.addClass(container, params.showClass.backdrop)
  // the workaround with setting/unsetting opacity is needed for #2019 and 2059
  popup.style.setProperty('opacity', '0', 'important')
  dom.show(popup)
  setTimeout(() => {
    // Animate popup right after showing it
    dom.addClass(popup, params.showClass.popup)
    // and remove the opacity workaround
    popup.style.removeProperty('opacity')
  })

  dom.addClass([document.documentElement, document.body], swalClasses.shown)
  if (params.heightAuto && params.backdrop && !params.toast) {
    dom.addClass([document.documentElement, document.body], swalClasses['height-auto'])
  }
}
