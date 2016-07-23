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
  ).done();

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


test('close button', function(assert) {
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


test('jQuery/js element as html param', function(assert) {
  swal({
    html: $('<p>jQuery element</p>')
  });
  assert.equal($('.swal2-content').html(), '<p>jQuery element</p>');

  var p = document.createElement('p');
  p.textContent = 'js element';
  swal({
    html: p
  });
  assert.equal($('.swal2-content').html(), '<p>js element</p>');
});


test('set and reset defaults', function(assert) {
  swal.setDefaults({confirmButtonText: 'Next >', showCancelButton: true});
  swal('Modal with changed defaults');
  assert.equal('Next >', $('.swal2-confirm').text());
  assert.ok($('.swal2-cancel').is(':visible'));

  swal.resetDefaults();
  swal('Modal after resetting defaults').done();
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

  swal.queue(steps).done();
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


test('disable/enable buttons', function(assert) {
  swal('test disable/enable buttons');

  swal.disableButtons();
  assert.ok($('.swal2-confirm').is(':disabled'));
  assert.ok($('.swal2-cancel').is(':disabled'));

  swal.enableButtons();
  assert.notOk($('.swal2-confirm').is(':disabled'));
  assert.notOk($('.swal2-cancel').is(':disabled'));

  swal.disableConfirmButton();
  assert.ok($('.swal2-confirm').is(':disabled'));

  swal.enableConfirmButton();
  assert.notOk($('.swal2-confirm').is(':disabled'));
});


test('input radio', function(assert) {
  swal({
    input: 'radio',
    inputOptions: {
      'one': 'one',
      'two': 'two'
    }
  });

  assert.equal($('.swal2-radio label').length, 2);
  assert.equal($('.swal2-radio input[type="radio"]').length, 2);
});


test('disable/enable input', function(assert) {
  swal({
    input: 'text'
  });

  swal.disableInput();
  assert.ok($('.swal2-input').is(':disabled'));
  swal.enableInput();
  assert.notOk($('.swal2-input').is(':disabled'));

  swal({
    input: 'radio',
    inputOptions: {
      'one': 'one',
      'two': 'two'
    }
  });

  swal.disableInput();
  $('.swal2-radio radio').each(function(radio) {
    assert.ok(radio.is(':disabled'));
  });
  swal.enableInput();
  $('.swal2-radio radio').each(function(radio) {
    assert.notOk(radio.is(':disabled'));
  });
});


test('default focus', function(assert) {
  swal('Modal with the Confirm button only');
  assert.ok(document.activeElement === $('.swal2-confirm')[0]);

  swal({
    text: 'Modal with two buttons',
    showCancelButton: true
  });
  assert.ok(document.activeElement === $('.swal2-confirm')[0]);

  swal({
    text: 'Modal with an input',
    input: 'text'
  });
  setTimeout(function() {
    assert.ok(document.activeElement === $('.swal2-input')[0]);
  }, 0);
});
