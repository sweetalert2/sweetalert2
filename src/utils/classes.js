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
  'select',
  'radio',
  'checkbox',
  'textarea',
  'validationerror'
]);

export var iconTypes = prefix([
  'success',
  'warning',
  'info',
  'question',
  'error'
]);
