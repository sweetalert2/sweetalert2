export const swalPrefix = 'swal2-'

export const prefix = (items) => {
  const result = {}

  for (const i in items) {
    result[items[i]] = prefixItem(items[i])
  }

  return result
}

export const prefixItem = (item) => {
  return swalPrefix + item
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
  'header',
  'content',
  'actions',
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
  'top-start',
  'top-end',
  'top-left',
  'top-right',
  'center',
  'center-start',
  'center-end',
  'center-left',
  'center-right',
  'bottom',
  'bottom-start',
  'bottom-end',
  'bottom-left',
  'bottom-right',
  'grow-row',
  'grow-column',
  'grow-fullscreen',
  'inputs-wrapper',
  'form-control',
  'radio-input-container',
  'checkbox-input-container',
  'radio-input',
  'checkbox-input'
])

export const iconTypes = prefix([
  'success',
  'warning',
  'info',
  'question',
  'error'
])
