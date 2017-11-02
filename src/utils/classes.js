export const swalPrefix = 'swal2-'

export const prefix = (items) => {
  const result = {}
  for (const i in items) {
    result[items[i]] = swalPrefix + items[i]
  }
  return result
}

export const swalClasses = prefix([
  'container',
  'shown',
  'iosfix',
  'popup',
  'modal',
  'no-backdrop',
  'toast',
  'toast-shown',
  'overlay',
  'fade',
  'show',
  'hide',
  'noanimation',
  'close',
  'title',
  'content',
  'contentwrapper',
  'buttonswrapper',
  'confirm',
  'cancel',
  'icon',
  'image',
  'input',
  'has-input',
  'file',
  'range',
  'select',
  'radio',
  'checkbox',
  'textarea',
  'inputerror',
  'validationerror',
  'progresssteps',
  'activeprogressstep',
  'progresscircle',
  'progressline',
  'loading',
  'styled',
  'top',
  'top-left',
  'top-right',
  'center',
  'center-left',
  'center-right',
  'bottom',
  'bottom-left',
  'bottom-right',
  'grow-row',
  'grow-column',
  'grow-fullscreen'
])

export const iconTypes = prefix([
  'success',
  'warning',
  'info',
  'question',
  'error'
])
