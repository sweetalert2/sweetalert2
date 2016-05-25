test('modal shows up', function() {
  var $modal = $('.swal2-modal');

  ok($modal.not(':visible'));
  swal('Hello world!');
  ok($modal.is(':visible'));
});


test('confirm button', function(assert) {
  var done = assert.async();

  swal('Confirm me').then(function(isConfirm) {
    equal(isConfirm, true);
    done();
  });

  swal.clickConfirm();
});

test('cancel button', function(assert) {
  var done = assert.async();

  swal('Cancel me').then(function(isConfirm) {
    equal(isConfirm, false);
    done();
  });

  swal.clickCancel();
});
