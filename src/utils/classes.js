export var swalPrefix = 'swal2-'

export var prefix = function (items) {
  var result = {}
  for (var i in items) {
    result[items[i]] = swalPrefix + items[i]
  }
  return result
}

export var swalClasses = prefix([
  'container',
  'in',
  'iosfix',
  'modal',
  'overlay',
  'fade',
  'show',
  'hide',
  'noanimation',
  'close',
  'content',
  'spacer',
  'confirm',
  'cancel',
  'icon',
  'image',
  'input',
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
  'styled'
])

export var iconTypes = prefix([
  'success',
  'warning',
  'info',
  'question',
  'error'
])
