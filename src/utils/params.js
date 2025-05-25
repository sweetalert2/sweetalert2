import { warn, warnAboutDeprecation } from '../utils/utils.js'

export const defaultParams = {
  title: '',
  titleText: '',
  text: '',
  html: '',
  footer: '',
  icon: undefined,
  iconColor: undefined,
  iconHtml: undefined,
  template: undefined,
  toast: false,
  draggable: false,
  animation: true,
  theme: 'light',
  showClass: {
    popup: 'swal2-show',
    backdrop: 'swal2-backdrop-show',
    icon: 'swal2-icon-show',
  },
  hideClass: {
    popup: 'swal2-hide',
    backdrop: 'swal2-backdrop-hide',
    icon: 'swal2-icon-hide',
  },
  customClass: {},
  target: 'body',
  color: undefined,
  backdrop: true,
  heightAuto: true,
  allowOutsideClick: true,
  allowEscapeKey: true,
  allowEnterKey: true,
  stopKeydownPropagation: true,
  keydownListenerCapture: false,
  showConfirmButton: true,
  showDenyButton: false,
  showCancelButton: false,
  preConfirm: undefined,
  preDeny: undefined,
  confirmButtonText: 'OK',
  confirmButtonAriaLabel: '',
  confirmButtonColor: undefined,
  denyButtonText: 'No',
  denyButtonAriaLabel: '',
  denyButtonColor: undefined,
  cancelButtonText: 'Cancel',
  cancelButtonAriaLabel: '',
  cancelButtonColor: undefined,
  buttonsStyling: true,
  reverseButtons: false,
  focusConfirm: true,
  focusDeny: false,
  focusCancel: false,
  returnFocus: true,
  showCloseButton: false,
  closeButtonHtml: '&times;',
  closeButtonAriaLabel: 'Close this dialog',
  loaderHtml: '',
  showLoaderOnConfirm: false,
  showLoaderOnDeny: false,
  imageUrl: undefined,
  imageWidth: undefined,
  imageHeight: undefined,
  imageAlt: '',
  timer: undefined,
  timerProgressBar: false,
  width: undefined,
  padding: undefined,
  background: undefined,
  input: undefined,
  inputPlaceholder: '',
  inputLabel: '',
  inputValue: '',
  inputOptions: {},
  inputAutoFocus: true,
  inputAutoTrim: true,
  inputAttributes: {},
  inputValidator: undefined,
  returnInputValueOnDeny: false,
  validationMessage: undefined,
  grow: false,
  position: 'center',
  progressSteps: [],
  currentProgressStep: undefined,
  progressStepsDistance: undefined,
  willOpen: undefined,
  didOpen: undefined,
  didRender: undefined,
  willClose: undefined,
  didClose: undefined,
  didDestroy: undefined,
  scrollbarPadding: true,
  topLayer: false,
}

export const updatableParams = [
  'allowEscapeKey',
  'allowOutsideClick',
  'background',
  'buttonsStyling',
  'cancelButtonAriaLabel',
  'cancelButtonColor',
  'cancelButtonText',
  'closeButtonAriaLabel',
  'closeButtonHtml',
  'color',
  'confirmButtonAriaLabel',
  'confirmButtonColor',
  'confirmButtonText',
  'currentProgressStep',
  'customClass',
  'denyButtonAriaLabel',
  'denyButtonColor',
  'denyButtonText',
  'didClose',
  'didDestroy',
  'draggable',
  'footer',
  'hideClass',
  'html',
  'icon',
  'iconColor',
  'iconHtml',
  'imageAlt',
  'imageHeight',
  'imageUrl',
  'imageWidth',
  'preConfirm',
  'preDeny',
  'progressSteps',
  'returnFocus',
  'reverseButtons',
  'showCancelButton',
  'showCloseButton',
  'showConfirmButton',
  'showDenyButton',
  'text',
  'title',
  'titleText',
  'theme',
  'willClose',
]

/** @type {Record<string, string | undefined>} */
export const deprecatedParams = {
  allowEnterKey: undefined,
}

const toastIncompatibleParams = [
  'allowOutsideClick',
  'allowEnterKey',
  'backdrop',
  'draggable',
  'focusConfirm',
  'focusDeny',
  'focusCancel',
  'returnFocus',
  'heightAuto',
  'keydownListenerCapture',
]

/**
 * Is valid parameter
 *
 * @param {string} paramName
 * @returns {boolean}
 */
export const isValidParameter = (paramName) => {
  return Object.prototype.hasOwnProperty.call(defaultParams, paramName)
}

/**
 * Is valid parameter for Swal.update() method
 *
 * @param {string} paramName
 * @returns {boolean}
 */
export const isUpdatableParameter = (paramName) => {
  return updatableParams.indexOf(paramName) !== -1
}

/**
 * Is deprecated parameter
 *
 * @param {string} paramName
 * @returns {string | undefined}
 */
export const isDeprecatedParameter = (paramName) => {
  return deprecatedParams[paramName]
}

/**
 * @param {string} param
 */
const checkIfParamIsValid = (param) => {
  if (!isValidParameter(param)) {
    warn(`Unknown parameter "${param}"`)
  }
}

/**
 * @param {string} param
 */
const checkIfToastParamIsValid = (param) => {
  if (toastIncompatibleParams.includes(param)) {
    warn(`The parameter "${param}" is incompatible with toasts`)
  }
}

/**
 * @param {string} param
 */
const checkIfParamIsDeprecated = (param) => {
  const isDeprecated = isDeprecatedParameter(param)
  if (isDeprecated) {
    warnAboutDeprecation(param, isDeprecated)
  }
}

/**
 * Show relevant warnings for given params
 *
 * @param {SweetAlertOptions} params
 */
export const showWarningsForParams = (params) => {
  if (params.backdrop === false && params.allowOutsideClick) {
    warn('"allowOutsideClick" parameter requires `backdrop` parameter to be set to `true`')
  }

  if (
    params.theme &&
    !['light', 'dark', 'auto', 'minimal', 'borderless', 'embed-iframe', 'bulma', 'bulma-light', 'bulma-dark'].includes(
      params.theme
    )
  ) {
    warn(`Invalid theme "${params.theme}"`)
  }

  for (const param in params) {
    checkIfParamIsValid(param)

    if (params.toast) {
      checkIfToastParamIsValid(param)
    }

    checkIfParamIsDeprecated(param)
  }
}

export default defaultParams
