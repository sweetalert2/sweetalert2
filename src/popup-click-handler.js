import { DismissReason } from './utils/DismissReason.js'
import { callIfFunction } from './utils/utils.js'

/**
 * @param {SweetAlertOptions} innerParams
 * @param {DomCache} domCache
 * @param {(dismiss: DismissReason) => void} dismissWith
 */
export const handlePopupClick = (innerParams, domCache, dismissWith) => {
  if (innerParams.toast) {
    handleToastClick(innerParams, domCache, dismissWith)
  } else {
    // Ignore click events that had mousedown on the popup but mouseup on the container
    // This can happen when the user drags a slider
    handleModalMousedown(domCache)

    // Ignore click events that had mousedown on the container but mouseup on the popup
    handleContainerMousedown(domCache)

    handleModalClick(innerParams, domCache, dismissWith)
  }
}

/**
 * @param {SweetAlertOptions} innerParams
 * @param {DomCache} domCache
 * @param {(dismiss: DismissReason) => void} dismissWith
 */
const handleToastClick = (innerParams, domCache, dismissWith) => {
  // Closing toast by internal click
  domCache.popup.onclick = () => {
    if (innerParams && (isAnyButtonShown(innerParams) || innerParams.timer || innerParams.input)) {
      return
    }
    dismissWith(DismissReason.close)
  }
}

/**
 * @param {SweetAlertOptions} innerParams
 * @returns {boolean}
 */
const isAnyButtonShown = (innerParams) => {
  return Boolean(
    innerParams.showConfirmButton ||
    innerParams.showDenyButton ||
    innerParams.showCancelButton ||
    innerParams.showCloseButton
  )
}

let ignoreOutsideClick = false

/**
 * @param {DomCache} domCache
 */
const handleModalMousedown = (domCache) => {
  domCache.popup.onmousedown = () => {
    domCache.container.onmouseup = function (e) {
      domCache.container.onmouseup = () => {}
      // We only check if the mouseup target is the container because usually it doesn't
      // have any other direct children aside of the popup
      if (e.target === domCache.container) {
        ignoreOutsideClick = true
      }
    }
  }
}

/**
 * @param {DomCache} domCache
 */
const handleContainerMousedown = (domCache) => {
  domCache.container.onmousedown = (e) => {
    // prevent the modal text from being selected on double click on the container (allowOutsideClick: false)
    if (e.target === domCache.container) {
      e.preventDefault()
    }
    domCache.popup.onmouseup = function (e) {
      domCache.popup.onmouseup = () => {}
      // We also need to check if the mouseup target is a child of the popup
      if (e.target === domCache.popup || (e.target instanceof HTMLElement && domCache.popup.contains(e.target))) {
        ignoreOutsideClick = true
      }
    }
  }
}

/**
 * @param {SweetAlertOptions} innerParams
 * @param {DomCache} domCache
 * @param {(dismiss: DismissReason) => void} dismissWith
 */
const handleModalClick = (innerParams, domCache, dismissWith) => {
  domCache.container.onclick = (e) => {
    if (ignoreOutsideClick) {
      ignoreOutsideClick = false
      return
    }
    if (e.target === domCache.container && callIfFunction(innerParams.allowOutsideClick)) {
      dismissWith(DismissReason.backdrop)
    }
  }
}
