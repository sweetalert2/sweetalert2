test('modal shows up', function(assert) {
  assert.notOk(swal.isVisible());
  swal('Hello world!');
  assert.ok(swal.isVisible());
});


test('modal width', function(assert) {
  swal({text: '400px', width: 300});
  assert.equal($('.swal2-modal')[0].style.width, '300px');

  swal({text: '500px', width: '400px'});
  assert.equal($('.swal2-modal')[0].style.width, '400px');

  swal({text: '90%', width: '90%'});
  assert.equal($('.swal2-modal')[0].style.width, '90%');

  swal({text: 'default width'});
  assert.equal($('.swal2-modal')[0].style.width, '500px');
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
  assert.equal($('.swal2-confirm').text(), 'Next >');
  assert.ok($('.swal2-cancel').is(':visible'));

  swal.resetDefaults();
  swal('Modal after resetting defaults').done();
  assert.equal($('.swal2-confirm').text(), 'OK');
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
  var done = assert.async();
  var steps = ['Step 1', 'Step 2'];

  swal.setDefaults({animation: false});
  swal.queue(steps).then(function() {
    swal('All done!');
  });
  assert.equal($('.swal2-modal h2').text(), 'Step 1');
  swal.clickConfirm();
  setTimeout(function() {
    assert.equal($('.swal2-modal h2').text(), 'Step 2');
    swal.clickConfirm();
    setTimeout(function() {
      assert.equal($('.swal2-modal h2').text(), 'All done!');
      swal.clickConfirm();

      // test queue is cancelled on first step, other steps shouldn't be shown
      swal.queue(steps).done();
      swal.clickCancel();
      assert.notOk(swal.isVisible());
      done();
    });
  });
});


test('dynamic queue', function(assert) {
  var done = assert.async();
  var stepGen = function(i) {
    switch (i) {
      case 0:
        return 'Step 1';
      case 1:
        return 'Step 2';
      default:
        break;
    }
  };

  swal.queue(stepGen).then(function() {
    swal('All done!');
  }).done();
  assert.equal($('.swal2-modal h2').text(), 'Step 1');
  swal.clickConfirm();
  setTimeout(function() {
    assert.equal($('.swal2-modal h2').text(), 'Step 2');

    // test Esc on Step 2 (#262)
    $(document).trigger($.Event('keydown', {
      keyCode: 27
    }));
    setTimeout(function() {
      assert.notOk(swal.isVisible());
      done();
    });
  });
});

test('state machine', function(assert) {
  var done = assert.async();
  var stepGen = function(obj) {
    swal.setDefaults({
      input: 'select',
      inputValidator: function(value) {
        switch (value) {
          case 'insert':
            obj.insert('Step 2');
            break;
          case 'fork':
            obj.fork(['Step 3', 'Step 4']);
            break;
          case 'repeatCurrent':
            obj.repeatCurrent();
            break;
          case 'terminate':
            obj.terminate();
            break;
          default:
            break;
        }
        return new Promise(function(resolve) {
          resolve();
        });
      }
    });
    switch (obj.current) {
      case 'Step 1':
        return {
          title: 'Step 1',
          inputOptions: { insert: 1 }
        };
      case 'Step 2':
        return {
          title: 'Step 2',
          inputOptions: { fork: 1 }
        };
      case 'Step 4':
        return {
          title: 'Step 4',
          inputOptions: { repeatCurrent: 1 }
        };
      case 'Step 5':
        return {
          title: 'Step 5',
          inputOptions: { terminate: 1 }
        };
      default:
        return obj.current;
    }
  };
  swal.queue(stepGen, ['Step 1', 'Step 5']).done();
  assert.equal($('.swal2-modal h2').text(), 'Step 1');
  swal.clickConfirm();
  setTimeout(function() {
    assert.equal($('.swal2-modal h2').text(), 'Step 2');
    swal.clickConfirm();
    setTimeout(function() {
      assert.equal($('.swal2-modal h2').text(), 'Step 3');
      swal.clickConfirm();
      setTimeout(function() {
        assert.equal($('.swal2-modal h2').text(), 'Step 4');
        swal.clickConfirm();
        setTimeout(function() {
          assert.equal($('.swal2-modal h2').text(), 'Step 4');
          swal.clickCancel();
          setTimeout(function() {
            assert.notOk(swal.isVisible());
            swal.queue(stepGen, ['Step 5', 'Step 1']);
            assert.equal($('.swal2-modal h2').text(), 'Step 5');
            swal.clickConfirm();
            setTimeout(function() {
              assert.notOk(swal.isVisible());
              done();
            });
          });
        });
      });
    });
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
  var done = assert.async();

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
    done();
  });
});


test('reversed buttons', function(assert) {
  swal({
    text: 'Modal with reversed buttons',
    reverseButtons: true
  });
  assert.ok($('.swal2-confirm').index() - $('.swal2-cancel').index() === 1);

  swal('Modal with buttons');
  assert.ok($('.swal2-cancel').index() - $('.swal2-confirm').index() === 1);
});


test('focus cancel', function(assert) {
  swal({
    text: 'Modal with Cancel button focused',
    showCancelButton: true,
    focusCancel: true
  });
  assert.ok(document.activeElement === $('.swal2-cancel')[0]);
});


test('image custom class', function(assert) {
  swal({
    text: 'Custom class is set',
    imageUrl: 'image.png',
    imageClass: 'image-custom-class'
  });
  assert.ok($('.swal2-image').hasClass('image-custom-class'));

  swal({
    text: 'Custom class isn\'t set',
    imageUrl: 'image.png'
  });
  assert.notOk($('.swal2-image').hasClass('image-custom-class'));
});


test('modal vertical offset', function(assert) {
  var done = assert.async(1);
  // create a modal with dynamic-height content
  swal({
    imageUrl: '../docs/vs_icon.png',
    title: 'Title',
    html: '<hr><div style="height: 50px"></div><p>Text content</p>',
    type: 'warning',
    input: 'text',
    animation: false
  });

  // if we can't load local images, load an external one instead
  $('.swal2-image').on('error', function() {
    this.src = 'https://unsplash.it/150/50?random';
  });

  // listen for image load
  $('.swal2-image').on('load', function() {
    var box = $('.swal2-modal')[0].getBoundingClientRect();
    var delta = box.top - (box.bottom - box.height);
    // allow 1px difference, in case of uneven height
    assert.ok(Math.abs(delta) <= 1);
    done();
  });
});
