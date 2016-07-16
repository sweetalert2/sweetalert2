test('modal shows up', function(assert) {
  var $modal = $('.swal2-modal');

  assert.ok($modal.not(':visible'));
  swal('Hello world!');
  assert.ok($modal.is(':visible'));
});


test('confirm button', function(assert) {
  var done = assert.async();

  swal('Confirm me').then(function(result) {
    assert.equal(result, true);
    done();
  });

  swal.clickConfirm();
});


test('custom buttons classes', function(assert) {
  swal({
    text: 'Modal with custom buttons classes',
    confirmButtonClass: 'btn btn-success',
    cancelButtonClass: 'btn btn-warning'
  });
  assert.ok($('.swal2-confirm').hasClass('btn'));
  assert.ok($('.swal2-confirm').hasClass('btn-success'));
  assert.ok($('.swal2-cancel').hasClass('btn'));
  assert.ok($('.swal2-cancel').hasClass('btn-warning'));

  swal('Modal with default buttons classes');
  assert.notOk($('.swal2-confirm').hasClass('btn'));
  assert.notOk($('.swal2-confirm').hasClass('btn-success'));
  assert.notOk($('.swal2-cancel').hasClass('btn'));
  assert.notOk($('.swal2-cancel').hasClass('btn-warning'));
});


test('cancel button', function(assert) {
  var done = assert.async();

  swal('Cancel me').then(
    function() {},
    function(dismiss) {
      assert.equal(dismiss, 'cancel');
      done();
    }
  );

  swal.clickCancel();
});


test('esc key', function(assert) {
  var done = assert.async();

  swal('Esc me').then(
    function() {},
    function(dismiss) {
      assert.equal(dismiss, 'esc');
      done();
    }
  );

  $(document).trigger($.Event('keydown', {
    keyCode: 27
  }));
});


test('overlay click', function(assert) {
  var done = assert.async();

  swal('Overlay click').then(
    function() {},
    function(dismiss) {
      assert.equal(dismiss, 'overlay');
      done();
    }
  );

  $('.swal2-overlay').click();
});


test('timer works', function(assert) {
  var done = assert.async();

  swal({title: 'Timer test', timer: 10, animation: false}).then(
    function() {},
    function(dismiss) {
      assert.equal(dismiss, 'timer');
      done();
    }
  );
});


test('Close button', function(assert) {
  var done = assert.async();

  swal({title: 'Close button test', showCloseButton: true}).then(
    function() {},
    function(dismiss) {
      assert.equal(dismiss, 'close');
      done();
    }
  );

  var $closeButton = $('.swal2-close');
  assert.ok($closeButton.is(':visible'));
  $closeButton.click();
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

  swal.clickCancel();
});


test('input text', function(assert) {
  var done = assert.async();

  var string = 'Live for yourself';
  swal({input: 'text'}).then(function(result) {
    assert.equal(result, string);
    done();
  });

  $('.swal2-input').val(string);
  swal.clickConfirm();
});


test('input select', function(assert) {
  var done = assert.async();

  var selected = 'dos';
  swal({input: 'select', inputOptions: {uno: 1, dos: 2} }).then(function(result) {
    assert.equal(result, selected);
    done();
  });

  $('.swal2-select').val(selected);
  swal.clickConfirm();
});


test('queue', function(assert) {
  var steps = ['Step 1', 'Step 2'];

  swal.queue(steps).then(function() {
    swal('All done!');
  });
  assert.equal('Step 1', $('.swal2-modal h2').text());
  swal.clickConfirm();
  setTimeout(function() {
    assert.equal('Step 2', $('.swal2-modal h2').text());
    swal.clickConfirm();
  });
  setTimeout(function() {
    assert.equal('All done!', $('.swal2-modal h2').text());
    swal.clickConfirm();
  });

  swal.queue(steps);
  swal.clickCancel();

  setTimeout(function() {
    assert.ok($('.swal2-cancel').is(':hidden'));
  });
});


test('showLoading and hideLoading', function(assert) {
  swal({
    title: 'test loading state',
    showCancelButton: true
  });

  swal.showLoading();
  assert.ok($('.swal2-confirm').hasClass('loading'));
  assert.ok($('.swal2-cancel').is(':disabled'));

  swal.hideLoading();
  assert.notOk($('.swal2-confirm').hasClass('loading'));
  assert.notOk($('.swal2-cancel').is(':disabled'));
});
