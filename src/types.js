/* oxlint-disable no-empty-file require-property-description */

/**
 * Instance methods assigned to `SweetAlert.prototype` in src/SweetAlert.js.
 * TypeScript 7 no longer infers prototype assignments as class members, so they are declared here.
 *
 * @typedef SweetAlertInstanceMethods
 * @property {typeof import('./instanceMethods.js').disableButtons} disableButtons
 * @property {typeof import('./instanceMethods.js').enableButtons} enableButtons
 * @property {typeof import('./instanceMethods.js').getInput} getInput
 * @property {typeof import('./instanceMethods.js').disableInput} disableInput
 * @property {typeof import('./instanceMethods.js').enableInput} enableInput
 * @property {typeof import('./instanceMethods.js').hideLoading} hideLoading
 * @property {typeof import('./instanceMethods.js').disableLoading} disableLoading
 * @property {typeof import('./instanceMethods.js').showValidationMessage} showValidationMessage
 * @property {typeof import('./instanceMethods.js').resetValidationMessage} resetValidationMessage
 * @property {typeof import('./instanceMethods.js').close} close
 * @property {typeof import('./instanceMethods.js').closePopup} closePopup
 * @property {typeof import('./instanceMethods.js').closeModal} closeModal
 * @property {typeof import('./instanceMethods.js').closeToast} closeToast
 * @property {typeof import('./instanceMethods.js').rejectPromise} rejectPromise
 * @property {typeof import('./instanceMethods.js').update} update
 * @property {typeof import('./instanceMethods.js')._destroy} _destroy
 */

/**
 * @typedef { import('./SweetAlert').SweetAlert & SweetAlertInstanceMethods } SweetAlert
 * @typedef { import('sweetalert2').SweetAlertOptions } SweetAlertOptions
 * @typedef { import('sweetalert2').SweetAlertCustomClass } SweetAlertCustomClass
 * @typedef { import('sweetalert2').SweetAlertIcon } SweetAlertIcon
 * @typedef { import('sweetalert2').SweetAlertInput } SweetAlertInput
 * @typedef { import('sweetalert2').SweetAlertResult } SweetAlertResult
 * @typedef { import('sweetalert2').SweetAlertOptions['inputValue'] } SweetAlertInputValue
 * @typedef { import('sweetalert2').DismissReason } DismissReason
 */

/**
 * @typedef { import('./utils/Timer').default } Timer
 * @typedef { import('./utils/EventEmitter').default } EventEmitter
 */

/**
 * @typedef GlobalState
 * @property {SweetAlert} [currentInstance]
 * @property {Element | null} [previousActiveElement]
 * @property {Timer} [timeout]
 * @property {EventEmitter} [eventEmitter]
 * @property {ReturnType<typeof setTimeout>} [restoreFocusTimeout]
 * @property {(this: HTMLElement, event: KeyboardEvent) => void} [keydownHandler]
 * @property {HTMLElement | (Window & typeof globalThis)} [keydownTarget]
 * @property {boolean} [keydownHandlerAdded]
 * @property {boolean} [keydownListenerCapture]
 * @property {() => void} [swalCloseEventFinishedCallback]
 * @property {boolean} [isRTL]
 */

/**
 * @typedef DomCache
 * @property {HTMLElement} popup
 * @property {HTMLElement} container
 * @property {HTMLElement} actions
 * @property {HTMLElement} confirmButton
 * @property {HTMLElement} denyButton
 * @property {HTMLElement} cancelButton
 * @property {HTMLElement} loader
 * @property {HTMLElement} closeButton
 * @property {HTMLElement} validationMessage
 * @property {HTMLElement} progressSteps
 */

/**
 * @typedef
 * { | 'container'
 *   | 'shown'
 *   | 'height-auto'
 *   | 'iosfix'
 *   | 'popup'
 *   | 'modal'
 *   | 'no-backdrop'
 *   | 'no-transition'
 *   | 'toast'
 *   | 'toast-shown'
 *   | 'show'
 *   | 'hide'
 *   | 'close'
 *   | 'title'
 *   | 'html-container'
 *   | 'actions'
 *   | 'confirm'
 *   | 'deny'
 *   | 'cancel'
 *   | 'footer'
 *   | 'icon'
 *   | 'icon-content'
 *   | 'image'
 *   | 'input'
 *   | 'file'
 *   | 'range'
 *   | 'select'
 *   | 'radio'
 *   | 'checkbox'
 *   | 'label'
 *   | 'textarea'
 *   | 'inputerror'
 *   | 'input-label'
 *   | 'validation-message'
 *   | 'progress-steps'
 *   | 'active-progress-step'
 *   | 'progress-step'
 *   | 'progress-step-line'
 *   | 'loader'
 *   | 'loading'
 *   | 'styled'
 *   | 'top'
 *   | 'top-start'
 *   | 'top-end'
 *   | 'top-left'
 *   | 'top-right'
 *   | 'center'
 *   | 'center-start'
 *   | 'center-end'
 *   | 'center-left'
 *   | 'center-right'
 *   | 'bottom'
 *   | 'bottom-start'
 *   | 'bottom-end'
 *   | 'bottom-left'
 *   | 'bottom-right'
 *   | 'grow-row'
 *   | 'grow-column'
 *   | 'grow-fullscreen'
 *   | 'rtl'
 *   | 'timer-progress-bar'
 *   | 'timer-progress-bar-container'
 *   | 'scrollbar-measure'
 *   | 'icon-success'
 *   | 'icon-warning'
 *   | 'icon-info'
 *   | 'icon-question'
 *   | 'icon-error'
 *   | 'draggable'
 *   | 'dragging'
 * } SwalClass
 */

/**
 * @typedef {(eventName: string) => void} EventHandler
 * @typedef {EventHandler[]} EventHandlers
 * @typedef {Record<string, EventHandlers>} Events
 */
