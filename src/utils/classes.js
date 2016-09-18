export var swalPrefix = 'swal2-';

export var prefix = function(items) {
  var result = {};
  for (var i in items) {
    result[items[i]] = swalPrefix + items[i];
  }
  return result;
};

export var swalClasses = prefix([
  'container',
  'in',
  'modal',
  'overlay',
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
  'validationerror',
  'progresssteps',
  'activeprogressstep',
  'progresscircle',
  'progressline'
]);

export var iconTypes = prefix([
  'success',
  'warning',
  'info',
  'question',
  'error'
]);
