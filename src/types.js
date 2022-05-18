/**
 * @typedef { import('sweetalert2').default } SweetAlert2
 * @typedef { import('sweetalert2').SweetAlertOptions } SweetAlertOptions
 */

/**
 * @typedef { import('./utils/Timer').default } Timer
 */

/**
 * @typedef GlobalState
 * @prop {SweetAlert2} [currentInstance]
 * @prop {Element} [previousActiveElement]
 * @prop {Timer} [timeout]
 * @prop {NodeJS.Timeout} [restoreFocusTimeout]
 * @prop {(this: HTMLElement, event: KeyboardEvent) => any} [keydownHandler]
 * @prop {HTMLElement | (Window & typeof globalThis)} [keydownTarget]
 * @prop {boolean} [keydownHandlerAdded]
 * @prop {boolean} [keydownListenerCapture]
 * @prop {function} [swalCloseEventFinishedCallback]
 */

/**
 * @typedef DomCache
 * @prop {HTMLElement} popup
 * @prop {HTMLElement} container
 * @prop {HTMLElement} actions
 * @prop {HTMLElement} confirmButton
 * @prop {HTMLElement} denyButton
 * @prop {HTMLElement} cancelButton
 * @prop {HTMLElement} loader
 * @prop {HTMLElement} closeButton
 * @prop {HTMLElement} validationMessage
 * @prop {HTMLElement} progressSteps
 */
