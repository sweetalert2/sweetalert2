import Swal from '../src/sweetalert2'
import { isVisible } from '../src/utils/dom'

export { default as Swal } from '../src/sweetalert2'

export const $ = document.querySelector.bind(document)

export const isHidden = (elem) => !isVisible(elem)

export const TIMEOUT = 10

// We *only* access `Swal` through this module, so that we can be sure `initialSwalPropNames` is set properly
export const SwalWithoutAnimation = Swal.mixin({
  showClass: {
    container: '',
    popup: '',
    icon: '',
  },
  hideClass: {
    container: '',
    popup: '',
    icon: '',
  },
})

export const dispatchCustomEvent = (elem, eventName, eventDetail = {}) => {
  const event = new CustomEvent(eventName, {
    bubbles: true,
    cancelable: true,
    detail: eventDetail,
  })
  elem.dispatchEvent(event)
}

export const triggerKeydownEvent = (target, key, params = {}) => {
  const e = document.createEvent('HTMLEvents')
  e.key = key
  e.initEvent(
    'keydown',
    true, // bubbles
    true // cancelable
  )
  for (const param in params) {
    e[param] = params[param]
  }
  target.dispatchEvent(e)
}

export const ensureClosed = () => {
  SwalWithoutAnimation.fire()
  SwalWithoutAnimation.close()
}
