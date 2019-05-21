import * as dom from './dom/index.js'
import { swalClasses } from '../utils/classes.js'

// Fix iOS scrolling http://stackoverflow.com/q/39626302

/* istanbul ignore next */
export const iOSfix = () => {
  const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
  if (iOS && !dom.hasClass(document.body, swalClasses.iosfix)) {
    const offset = document.body.scrollTop
    document.body.style.top = (offset * -1) + 'px'
    dom.addClass(document.body, swalClasses.iosfix)
    lockBodyScroll()
  }
}

const lockBodyScroll = () => { // #1246
  let preventTouchMove
  dom.getContainer().ontouchstart = (e) => {
    preventTouchMove =
      e.target === dom.getContainer() ||
      !(dom.isScrollable(dom.getContainer()))
  }
  dom.getContainer().ontouchmove = (e) => {
    if (preventTouchMove) {
      e.preventDefault()
      e.stopPropagation()
    }
  }
}

/* istanbul ignore next */
export const undoIOSfix = () => {
  if (dom.hasClass(document.body, swalClasses.iosfix)) {
    const offset = parseInt(document.body.style.top, 10)
    dom.removeClass(document.body, swalClasses.iosfix)
    document.body.style.top = ''
    document.body.scrollTop = (offset * -1)
  }
}
