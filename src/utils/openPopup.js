import * as dom from './dom/index.js'
import { swalClasses } from './classes.js'
import { fixScrollbar } from './scrollbarFix.js'
import { iOSfix } from './iosFix.js'
import { IEfix } from './ieFix.js'
import { setAriaHidden } from './aria.js'
import globalState from '../globalState.js'

function swalOpenAnimationFinished (popup, container) {
  popup.removeEventListener(dom.animationEndEvent, swalOpenAnimationFinished)
  container.style.overflowY = 'auto'
}

/**
 * Open popup, add necessary classes and styles, fix scrollbar
 *
 * @param {Array} params
 */
export const openPopup = (params) => {
  const container = dom.getContainer()
  const popup = dom.getPopup()

  if (typeof params.onBeforeOpen === 'function') {
    params.onBeforeOpen(popup)
  }

  addClasses(container, popup, params)

  // scrolling is 'hidden' until animation is done, after that 'auto'
  setScrollingVisibility(container, popup)

  if (dom.isModal()) {
    fixScrollContainer(container, params.scrollbarPadding)
  }

  if (!dom.isToast() && !globalState.previousActiveElement) {
    globalState.previousActiveElement = document.activeElement
  }
  if (typeof params.onOpen === 'function') {
    setTimeout(() => params.onOpen(popup))
  }
}

const setScrollingVisibility = (container, popup) => {
  if (dom.animationEndEvent && dom.hasCssAnimation(popup)) {
    container.style.overflowY = 'hidden'
    popup.addEventListener(dom.animationEndEvent, swalOpenAnimationFinished.bind(null, popup, container))
  } else {
    container.style.overflowY = 'auto'
  }
}

const fixScrollContainer = (container, scrollbarPadding) => {
  iOSfix()
  IEfix()
  setAriaHidden()

  if (scrollbarPadding) {
    fixScrollbar()
  }

  // sweetalert2/issues/1247
  setTimeout(() => {
    container.scrollTop = 0
  })
}

const addClasses = (container, popup, params) => {
  if (params.animation) {
    dom.addClass(popup, swalClasses.show)
    dom.addClass(container, swalClasses.fade)
  }
  dom.show(popup)

  dom.addClass([document.documentElement, document.body, container], swalClasses.shown)
  if (params.heightAuto && params.backdrop && !params.toast) {
    dom.addClass([document.documentElement, document.body], swalClasses['height-auto'])
  }
}
