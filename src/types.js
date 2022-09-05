/**
 * @typedef { import('sweetalert2').default } SweetAlert2
 * @typedef { import('sweetalert2').SweetAlertOptions } SweetAlertOptions
 * @typedef { import('sweetalert2').SweetAlertIcon } SweetAlertIcon
 * @typedef { import('sweetalert2').SweetAlertInput } SweetAlertInput
 */

/**
 * @typedef { import('./utils/Timer').default } Timer
 */

/**
 * @typedef GlobalState
 * @property {SweetAlert2} [currentInstance]
 * @property {Element} [previousActiveElement]
 * @property {Timer} [timeout]
 * @property {NodeJS.Timeout} [restoreFocusTimeout]
 * @property {(this: HTMLElement, event: KeyboardEvent) => any} [keydownHandler]
 * @property {HTMLElement | (Window & typeof globalThis)} [keydownTarget]
 * @property {boolean} [keydownHandlerAdded]
 * @property {boolean} [keydownListenerCapture]
 * @property {Function} [swalCloseEventFinishedCallback]
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
