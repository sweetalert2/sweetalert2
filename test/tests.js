
test('modal shows up', function(assert) {
  var $modal = $('.swal2-modal');

  assert.ok($modal.not(':visible'));
  swal('Hello world!');
  assert.ok($modal.is(':visible'));
});


test('confirm button', function(assert) {
  var done = assert.async();

  swal('Confirm me').then(function(isConfirm) {
    assert.equal(isConfirm, true);
    done();
  });

  swal.clickConfirm();
});


test('cancel button', function(assert) {
  var done = assert.async();

  swal('Cancel me').then(function(isConfirm) {
    assert.equal(isConfirm, false);
    done();
  });

  swal.clickCancel();
});


test('esc key', function(assert) {
  var done = assert.async();

  swal('Esc me').then(function(isConfirm) {
    assert.equal(typeof isConfirm, 'undefined');
    done();
  });

  $(document).trigger($.Event('keydown', {
    keyCode: 27
  }));
});


test('overlay click', function(assert) {
  var done = assert.async();

  swal('Close me by overlay click').then(function(isConfirm) {
    assert.equal(typeof isConfirm, 'undefined');
    done();
  });

  $('.swal2-overlay').click();
});


test('timer works', function(assert) {
  var done = assert.async();
  var $modal = $('.swal2-modal');

  swal({title: 'Timer test', timer: 10, animation: false}).then(function(isConfirm) {
    assert.equal(typeof isConfirm, 'undefined');
  });

  setTimeout(function() {
    assert.ok($modal.is(':hidden'));
    done();
  }, 20);
});


test('set and reset defaults', function(assert) {
  swal.setDefaults({confirmButtonText: 'Next >', showCancelButton: true});
  swal('Modal with changed defaults');
  assert.equal('Next >', $('.swal2-confirm').text());
  assert.ok($('.swal2-cancel').is(':visible'));

  swal.resetDefaults();
  swal('Modal after resetting defaults');
  assert.equal('OK', $('.swal2-confirm').text());
  assert.ok($('.swal2-cancel').is(':hidden'));
});
