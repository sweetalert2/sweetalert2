import * as dom from './dom/index'
import { swalClasses } from './classes'
import { fixScrollbar } from './scrollbarFix'
import { iOSfix } from './iosFix'
import { setAriaHidden } from './aria'
import globalState from '../globalState'

/**
 * Open popup, add necessary classes and styles, fix scrollbar
 *
 * @param {Array} params
 */
export const openPopup = (params) => {
  const container = dom.getContainer()
  const popup = dom.getPopup()

  if (params.onBeforeOpen !== null && typeof params.onBeforeOpen === 'function') {
    params.onBeforeOpen(popup)
  }

  if (params.animation) {
    dom.addClass(popup, swalClasses.show)
    dom.addClass(container, swalClasses.fade)
    dom.removeClass(popup, swalClasses.hide)
  } else {
    dom.removeClass(popup, swalClasses.fade)
  }
  dom.show(popup)

  // scrolling is 'hidden' until animation is done, after that 'auto'
  container.style.overflowY = 'hidden'
  if (dom.animationEndEvent && !dom.hasClass(popup, swalClasses.noanimation)) {
    popup.addEventListener(dom.animationEndEvent, function swalCloseEventFinished () {
      popup.removeEventListener(dom.animationEndEvent, swalCloseEventFinished)
      container.style.overflowY = 'auto'
    })
  } else {
    container.style.overflowY = 'auto'
  }

  dom.addClass([document.documentElement, document.body, container], swalClasses.shown)
  if (params.heightAuto && params.backdrop && !params.toast) {
    dom.addClass([document.documentElement, document.body], swalClasses['height-auto'])
  }

  if (dom.isModal()) {
    fixScrollbar()
    iOSfix()
    setAriaHidden()
  }
  if (!dom.isToast() && !globalState.previousActiveElement) {
    globalState.previousActiveElement = document.activeElement
  }
  if (params.onOpen !== null && typeof params.onOpen === 'function') {
    setTimeout(() => {
      params.onOpen(popup)
    })
  }
}
