/** @typedef {'cancel' | 'backdrop' | 'close' | 'esc' | 'timer'} DismissReason */

/** @type {Record<DismissReason, DismissReason>} */
export const DismissReason = Object.freeze({
  cancel: 'cancel',
  backdrop: 'backdrop',
  close: 'close',
  esc: 'esc',
  timer: 'timer',
})
