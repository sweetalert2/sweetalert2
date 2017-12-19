/* global $, QUnit, swal */

const simulateMouseEvent = (x, y, eventType) => {
  var event = $.Event(eventType)
  event.clientX = x
  event.clientY = y
  $(document.elementFromPoint(x, y)).trigger(event)
}

QUnit.test('version is correct semver', (assert) => {
  assert.ok(swal.version.match(/\d+\.\d+\.\d+/))
})

QUnit.test('modal shows up', (assert) => {
  swal('Hello world!')
  assert.ok(swal.isVisible())
})

QUnit.test('modal width', (assert) => {
  swal({text: '400px', width: 300})
  assert.equal($('.swal2-modal')[0].style.width, '300px')

  swal({text: '500px', width: '400px'})
  assert.equal($('.swal2-modal')[0].style.width, '400px')

  swal({text: '90%', width: '90%'})
  assert.equal($('.swal2-modal')[0].style.width, '90%')

  swal({text: 'default width'})
  assert.equal($('.swal2-modal')[0].style.width, '500px')
})

QUnit.test('window keydown handler', (assert) => {
  swal('hi')
  assert.ok(window.onkeydown)
  swal.close()
  assert.equal(window.onkeydown, null)

  swal('first call')
  swal('second call')
  assert.ok(window.onkeydown)
  swal.close()
  assert.equal(window.onkeydown, null)
})

QUnit.test('getters', (assert) => {
  swal('Title', 'Content')
  assert.equal(swal.getTitle().innerText, 'Title')
  assert.equal(swal.getContent().innerText, 'Content')

  swal({
    showCancelButton: true,
    imageUrl: 'image.png',
    confirmButtonText: 'Confirm button',
    confirmButtonAriaLabel: 'Confirm button aria-label',
    cancelButtonText: 'Cancel button',
    cancelButtonAriaLabel: 'Cancel button aria-label'
  })
  assert.ok(swal.getImage().src.indexOf('image.png'))
  assert.equal(swal.getButtonsWrapper().textContent, 'Confirm buttonCancel button')
  assert.equal(swal.getConfirmButton().innerText, 'Confirm button')
  assert.equal(swal.getCancelButton().innerText, 'Cancel button')
  assert.equal(swal.getConfirmButton().getAttribute('aria-label'), 'Confirm button aria-label')
  assert.equal(swal.getCancelButton().getAttribute('aria-label'), 'Cancel button aria-label')

  swal({input: 'text'})
  $('.swal2-input').val('input text')
  assert.equal(swal.getInput().value, 'input text')

  swal({
    input: 'radio',
    inputOptions: {
      'one': 'one',
      'two': 'two'
    }
  })
  $('.swal2-radio input[value="two"]').prop('checked', true)
  assert.equal(swal.getInput().value, 'two')
})

QUnit.test('custom buttons classes', (assert) => {
  swal({
    text: 'Modal with custom buttons classes',
    confirmButtonClass: 'btn btn-success ',
    cancelButtonClass: 'btn btn-warning '
  })
  assert.ok($('.swal2-confirm').hasClass('btn'))
  assert.ok($('.swal2-confirm').hasClass('btn-success'))
  assert.ok($('.swal2-cancel').hasClass('btn'))
  assert.ok($('.swal2-cancel').hasClass('btn-warning'))

  swal('Modal with default buttons classes')
  assert.notOk($('.swal2-confirm').hasClass('btn'))
  assert.notOk($('.swal2-confirm').hasClass('btn-success'))
  assert.notOk($('.swal2-cancel').hasClass('btn'))
  assert.notOk($('.swal2-cancel').hasClass('btn-warning'))
})

QUnit.test('content/title is set (html)', (assert) => {
  swal({
    title: '<strong>Strong</strong>, <em>Emphasis</em>',
    html: '<p>Paragraph</p><img /><button></button>'
  })

  assert.equal($('strong, em', '.swal2-title').length, 2)
  assert.equal($('p, img, button', '.swal2-content').length, 3)
})

QUnit.test('content/title is set (text)', (assert) => {
  swal({
    titleText: '<strong>Strong</strong>, <em>Emphasis</em>',
    text: '<p>Paragraph</p><img /><button></button>'
  })

  assert.equal($('.swal2-title').text(), '<strong>Strong</strong>, <em>Emphasis</em>')
  assert.equal($('.swal2-content').text(), '<p>Paragraph</p><img /><button></button>')
  assert.equal($('strong, em', '.swal2-title').length, 0)
  assert.equal($('p, img, button', '.swal2-content').length, 0)
})

QUnit.test('jQuery/js element as html param', (assert) => {
  swal({
    html: $('<p>jQuery element</p>')
  })
  assert.equal($('.swal2-content').html(), '<p>jQuery element</p>')

  const p = document.createElement('p')
  p.textContent = 'js element'
  swal({
    html: p
  })
  assert.equal($('.swal2-content').html(), '<p>js element</p>')
})

QUnit.test('set and reset defaults', (assert) => {
  swal.setDefaults({confirmButtonText: 'Next >', showCancelButton: true})
  swal('Modal with changed defaults')
  assert.equal($('.swal2-confirm').text(), 'Next >')
  assert.ok($('.swal2-cancel').is(':visible'))

  swal.resetDefaults()
  swal('Modal after resetting defaults')
  assert.equal($('.swal2-confirm').text(), 'OK')
  assert.ok($('.swal2-cancel').is(':hidden'))

  swal.clickCancel()
})

QUnit.test('input text', (assert) => {
  const done = assert.async()

  const string = 'Live for yourself'
  swal({input: 'text'}).then((result) => {
    assert.equal(result.value, string)
    done()
  })

  $('.swal2-input').val(string)
  swal.clickConfirm()
})

QUnit.test('validation error', (assert) => {
  const done = assert.async()
  const inputValidator = (value) => Promise.resolve(!value && 'no falsy values')

  swal({input: 'text', animation: false, inputValidator})
  assert.ok($('.swal2-validationerror').is(':hidden'))
  setTimeout(() => {
    const initialModalHeight = $('.swal2-modal').outerHeight()

    swal.clickConfirm()
    setTimeout(() => {
      assert.ok($('.swal2-validationerror').is(':visible'))
      assert.equal($('.swal2-validationerror').text(), 'no falsy values')
      assert.ok($('.swal2-input').attr('aria-invalid'))
      assert.ok($('.swal2-modal').outerHeight() > initialModalHeight)

      $('.swal2-input').val('blah-blah').trigger('input')
      assert.ok($('.swal2-validationerror').is(':hidden'))
      assert.notOk($('.swal2-input').attr('aria-invalid'))
      assert.ok($('.swal2-modal').outerHeight() === initialModalHeight)
      done()
    })
  }, 60)
})

QUnit.test('built-in email validation', (assert) => {
  const done = assert.async()

  var validEmailAddress = 'team+support+a.b@example.com'
  swal({input: 'email'}).then((result) => {
    assert.equal(result.value, validEmailAddress)
    done()
  })

  $('.swal2-input').val(validEmailAddress)
  swal.clickConfirm()
})

QUnit.test('input select', (assert) => {
  const done = assert.async()

  const selected = 'dos'
  swal({
    input: 'select',
    inputOptions: {uno: 1, dos: 2}
  }).then((result) => {
    assert.equal(result.value, selected)
    done()
  })

  $('.swal2-select').val(selected)
  swal.clickConfirm()
})

QUnit.test('input checkbox', (assert) => {
  const done = assert.async()

  swal({input: 'checkbox', inputAttributes: {name: 'test-checkbox'}}).then((result) => {
    assert.equal(checkbox.attr('name'), 'test-checkbox')
    assert.equal(result.value, '1')
    done()
  })

  const checkbox = $('.swal2-checkbox input')
  checkbox.prop('checked', true)
  swal.clickConfirm()
})

QUnit.test('input range', (assert) => {
  swal({ input: 'range', inputAttributes: {min: 1, max: 10}, inputValue: 5 })
  const input = $('.swal2-range input')
  assert.equal(input.attr('min'), '1')
  assert.equal(input.attr('max'), '10')
  assert.equal(input.val(), '5')
})

QUnit.test('queue', (assert) => {
  const done = assert.async()
  const steps = ['Step 1', 'Step 2']

  assert.equal(swal.getQueueStep(), null)

  swal.setDefaults({animation: false})
  swal.queue(steps).then(() => {
    swal('All done!')
  })

  assert.equal($('.swal2-modal h2').text(), 'Step 1')
  assert.equal(swal.getQueueStep(), 0)
  swal.clickConfirm()

  setTimeout(() => {
    assert.equal($('.swal2-modal h2').text(), 'Step 2')
    assert.equal(swal.getQueueStep(), 1)
    swal.clickConfirm()

    setTimeout(() => {
      assert.equal($('.swal2-modal h2').text(), 'All done!')
      assert.equal(swal.getQueueStep(), null)
      swal.clickConfirm()

      // test queue is cancelled on first step, other steps shouldn't be shown
      swal.queue(steps)
      swal.clickCancel()
      assert.notOk(swal.isVisible())
      done()
    })
  })
})

QUnit.test('dymanic queue', (assert) => {
  const done = assert.async()
  const steps = [
    {
      title: 'Step 1',
      preConfirm: () => {
        return new Promise((resolve) => {
          // insert to the end by default
          swal.insertQueueStep('Step 3')
          // step to be deleted
          swal.insertQueueStep('Step to be deleted')
          // insert with positioning
          swal.insertQueueStep({
            title: 'Step 2',
            preConfirm: () => {
              return new Promise((resolve) => {
                swal.deleteQueueStep(3)
                resolve()
              })
            }
          }, 1)
          resolve()
        })
      }
    }
  ]

  swal.setDefaults({animation: false})
  swal.queue(steps).then(() => {
    swal('All done!')
  })

  assert.equal($('.swal2-modal h2').text(), 'Step 1')
  swal.clickConfirm()

  setTimeout(() => {
    assert.equal($('.swal2-modal h2').text(), 'Step 2')
    assert.equal(swal.getQueueStep(), 1)
    swal.clickConfirm()

    setTimeout(() => {
      assert.equal($('.swal2-modal h2').text(), 'Step 3')
      assert.equal(swal.getQueueStep(), 2)
      swal.clickConfirm()

      setTimeout(() => {
        assert.equal($('.swal2-modal h2').text(), 'All done!')
        assert.equal(swal.getQueueStep(), null)
        swal.clickConfirm()
        done()
      })
    })
  })
})

QUnit.test('showLoading and hideLoading', (assert) => {
  swal.showLoading()
  assert.ok($('.swal2-buttonswrapper').hasClass('swal2-loading'))
  assert.ok($('.swal2-cancel').is(':disabled'))

  swal.hideLoading()
  assert.notOk($('.swal2-buttonswrapper').hasClass('swal2-loading'))
  assert.notOk($('.swal2-cancel').is(':disabled'))

  swal({
    title: 'test loading state',
    showConfirmButton: false
  })

  swal.showLoading()
  assert.ok($('.swal2-buttonswrapper').is(':visible'))
  assert.ok($('.swal2-buttonswrapper').hasClass('swal2-loading'))

  swal.hideLoading()
  assert.notOk($('.swal2-buttonswrapper').is(':visible'))
  assert.notOk($('.swal2-buttonswrapper').hasClass('swal2-loading'))
})

QUnit.test('disable/enable buttons', (assert) => {
  swal('test disable/enable buttons')

  swal.disableButtons()
  assert.ok($('.swal2-confirm').is(':disabled'))
  assert.ok($('.swal2-cancel').is(':disabled'))

  swal.enableButtons()
  assert.notOk($('.swal2-confirm').is(':disabled'))
  assert.notOk($('.swal2-cancel').is(':disabled'))

  swal.disableConfirmButton()
  assert.ok($('.swal2-confirm').is(':disabled'))

  swal.enableConfirmButton()
  assert.notOk($('.swal2-confirm').is(':disabled'))
})

QUnit.test('input radio', (assert) => {
  swal({
    input: 'radio',
    inputOptions: {
      'one': 'one',
      'two': 'two'
    }
  })

  assert.equal($('.swal2-radio label').length, 2)
  assert.equal($('.swal2-radio input[type="radio"]').length, 2)
})

QUnit.test('disable/enable input', (assert) => {
  swal({
    input: 'text'
  })

  swal.disableInput()
  assert.ok($('.swal2-input').is(':disabled'))
  swal.enableInput()
  assert.notOk($('.swal2-input').is(':disabled'))

  swal({
    input: 'radio',
    inputOptions: {
      'one': 'one',
      'two': 'two'
    }
  })

  swal.disableInput()
  $('.swal2-radio radio').each((radio) => {
    assert.ok(radio.is(':disabled'))
  })
  swal.enableInput()
  $('.swal2-radio radio').each((radio) => {
    assert.notOk(radio.is(':disabled'))
  })
})

QUnit.test('default focus', (assert) => {
  const done = assert.async()

  swal('Modal with the Confirm button only')
  assert.ok(document.activeElement === $('.swal2-confirm')[0])

  swal({
    text: 'Modal with two buttons',
    showCancelButton: true
  })
  assert.ok(document.activeElement === $('.swal2-confirm')[0])

  swal({
    text: 'Modal with an input',
    input: 'text'
  })
  setTimeout(() => {
    assert.ok(document.activeElement === $('.swal2-input')[0])
    done()
  })
})

QUnit.test('reversed buttons', (assert) => {
  swal({
    text: 'Modal with reversed buttons',
    reverseButtons: true
  })
  assert.ok($('.swal2-confirm').index() - $('.swal2-cancel').index() === 1)

  swal('Modal with buttons')
  assert.ok($('.swal2-cancel').index() - $('.swal2-confirm').index() === 1)
})

QUnit.test('focusConfirm', (assert) => {
  swal({
    showCancelButton: true
  })
  assert.ok(document.activeElement === $('.swal2-confirm')[0])

  const anchor = $('<a href>link</a>')
  swal({
    html: anchor,
    showCancelButton: true,
    focusConfirm: false
  })
  assert.ok(document.activeElement.outerHTML === anchor[0].outerHTML)
})

QUnit.test('focusCancel', (assert) => {
  swal({
    text: 'Modal with Cancel button focused',
    showCancelButton: true,
    focusCancel: true
  })
  assert.ok(document.activeElement === $('.swal2-cancel')[0])
})

QUnit.test('image alt text and custom class', (assert) => {
  swal({
    text: 'Custom class is set',
    imageUrl: 'image.png',
    imageAlt: 'Custom icon',
    imageClass: 'image-custom-class'
  })
  assert.ok($('.swal2-image').hasClass('image-custom-class'))
  assert.equal($('.swal2-image').attr('alt'), 'Custom icon')

  swal({
    text: 'Custom class isn\'t set',
    imageUrl: 'image.png'
  })
  assert.notOk($('.swal2-image').hasClass('image-custom-class'))
})

QUnit.test('modal vertical offset', (assert) => {
  const done = assert.async(1)
  // create a modal with dynamic-height content
  swal({
    imageUrl: '../assets/vs_icon.png',
    title: 'Title',
    html: '<hr><div style="height: 50px"></div><p>Text content</p>',
    type: 'warning',
    input: 'text',
    animation: false
  })

  // if we can't load local images, load an external one instead
  $('.swal2-image').on('error', () => {
    this.src = 'https://unsplash.it/150/50?random'
  })

  // listen for image load
  $('.swal2-image').on('load', () => {
    const box = $('.swal2-modal')[0].getBoundingClientRect()
    const delta = box.top - (box.bottom - box.height)
    // allow 1px difference, in case of uneven height
    assert.ok(Math.abs(delta) <= 1)
    done()
  })
})

QUnit.test('target', (assert) => {
  const warn = console.warn // Suppress the warnings
  console.warn = () => true // Suppress the warnings
  swal('Default target')
  assert.equal(document.body, document.querySelector('.swal2-container').parentNode)
  swal.close()

  swal({title: 'Custom valid target (string)', target: '#qunit'}) // switch targets
  assert.equal(document.querySelector('#qunit'), document.querySelector('.swal2-container').parentNode)
  swal.close()

  swal({title: 'Custom invalid target (string)', target: 'lorem_ipsum'}) // switch targets
  assert.equal(document.body, document.querySelector('.swal2-container').parentNode)
  swal.close()

  swal({ title: 'Custom valid target (element)', target: $('#qunit')[0] })
  assert.equal($('#qunit')[0], document.querySelector('.swal2-container').parentNode)
  swal.close()

  swal({ title: 'Custom invalid target (element)', target: true })
  assert.equal(document.body, document.querySelector('.swal2-container').parentNode)
  swal.close()
  console.warn = warn // Suppress the warnings
})

QUnit.test('onOpen', (assert) => {
  const done = assert.async()

  // create a modal with an onOpen callback
  swal({
    title: 'onOpen test',
    onOpen: ($modal) => {
      assert.ok($('.swal2-modal').is($modal))
      done()
    }
  })
})

QUnit.test('onBeforeOpen', (assert) => {
  const done = assert.async()

  // create a modal with an onBeforeOpen callback
  swal({
    title: 'onBeforeOpen test',
    onBeforeOpen: ($modal) => {
      assert.ok($('.swal2-modal').is($modal))
    }
  })

  // check that onBeforeOpen calls properly
  const dynamicTitle = 'Set onBeforeOpen title'
  swal({
    title: 'onBeforeOpen test',
    onBeforeOpen: ($modal) => {
      $('.swal2-title').html(dynamicTitle)
    },
    onOpen: () => {
      assert.equal($('.swal2-title').html(), dynamicTitle)
      done()
    }
  })
})

QUnit.test('onClose', (assert) => {
  const done = assert.async()

  // create a modal with an onClose callback
  swal({
    title: 'onClose test',
    onClose: (_$modal) => {
      assert.ok($modal.is(_$modal))
      done()
    }
  })

  const $modal = $('.swal2-modal')
  $('.swal2-close').click()
})
QUnit.test('esc key', (assert) => {
  const done = assert.async()

  swal({
    title: 'Esc me'
  }).then(
    (result) => {
      assert.deepEqual(result, {dismiss: 'esc'})
      done()
    },
    () => {}
  )

  $(document).trigger($.Event('keydown', {
    key: 'Escape'
  }))
})
QUnit.test('close button', (assert) => {
  const done = assert.async()

  swal({
    title: 'Close button test',
    showCloseButton: true
  }).then(
    (result) => {
      assert.deepEqual(result, {dismiss: 'close'})
      done()
    },
    () => {}
  )

  const $closeButton = $('.swal2-close')
  assert.ok($closeButton.is(':visible'))
  assert.equal($closeButton.attr('aria-label'), 'Close this dialog')
  $closeButton.click()
})
QUnit.test('overlay click', (assert) => {
  const done = assert.async()

  swal({
    title: 'Overlay click'
  }).then(
    (result) => {
      assert.deepEqual(result, {dismiss: 'overlay'})
      done()
    },
    () => {}
  )

  $('.swal2-container').click()
})
QUnit.test('popup mousedown, overlay mouseup', (assert) => {
  const done = assert.async()

  swal({
    title: 'popup mousedown, overlay mouseup'
  })

  simulateMouseEvent(1, 1, 'mousedown')
  simulateMouseEvent(window.innerWidth / 2, window.innerHeight / 2, 'mouseup')

  setTimeout(() => {
    assert.ok(swal.isVisible())
    done()
  }, 300)
})
QUnit.test('overlay mousedown, popup mouseup', (assert) => {
  const done = assert.async()

  swal({
    title: 'overlay mousedown, popup mouseup'
  })

  simulateMouseEvent(window.innerWidth / 2, window.innerHeight / 2, 'mousedown')
  simulateMouseEvent(1, 1, 'mouseup')

  setTimeout(() => {
    assert.ok(swal.isVisible())
    done()
  }, 300)
})
QUnit.test('cancel button', (assert) => {
  const done = assert.async()

  swal({
    title: 'Cancel me'
  }).then(
    (result) => {
      assert.deepEqual(result, {dismiss: 'cancel'})
      done()
    },
    () => {}
  )

  swal.clickCancel()
})
QUnit.test('timer', (assert) => {
  const done = assert.async()

  swal({
    title: 'Timer test',
    timer: 10,
    animation: false
  }).then(
    (result) => {
      assert.deepEqual(result, {dismiss: 'timer'})
      done()
    },
    () => {}
  )
})
QUnit.test('confirm button', (assert) => {
  const done = assert.async()
  swal({
    input: 'radio',
    inputOptions: {
      'one': 'one',
      'two': 'two'
    }
  }).then((result) => {
    assert.deepEqual(result, {value: 'two'})
    done()
  })
  $('.swal2-radio input[value="two"]').prop('checked', true)
  swal.clickConfirm()
})

QUnit.test('on errors in *async* user-defined functions, cleans up and propagates the error', (assert) => {
  const done = assert.async()

  const expectedError = new Error('my bad')
  const erroringFunction = () => {
    return Promise.reject(expectedError)
  }

  // inputValidator
  const rejectedPromise = swal({input: 'text', expectRejections: false, inputValidator: erroringFunction})
  swal.clickConfirm()
  rejectedPromise.catch((error) => {
    assert.equal(error, expectedError) // error is bubbled up back to user code
    setTimeout(() => {
      assert.notOk(swal.isVisible()) // display is cleaned up

      // preConfirm
      const rejectedPromise = swal({expectRejections: false, preConfirm: erroringFunction})
      swal.clickConfirm()
      rejectedPromise.catch((error) => {
        assert.equal(error, expectedError) // error is bubbled up back to user code
        setTimeout(() => {
          assert.notOk(swal.isVisible()) // display is cleaned up

          done()
        }, 60)
      })
    }, 60)
  })
})

QUnit.test('params validation', (assert) => {
  assert.ok(swal.isValidParameter('title'))
  assert.notOk(swal.isValidParameter('foobar'))
})

QUnit.test('addition and removal of backdrop', (assert) => {
  swal({backdrop: false})
  assert.ok(document.body.classList.contains('swal2-no-backdrop'))
  assert.ok(document.documentElement.classList.contains('swal2-no-backdrop'))
  swal({title: 'test'})
  assert.notOk(document.body.classList.contains('swal2-no-backdrop'))
  assert.notOk(document.documentElement.classList.contains('swal2-no-backdrop'))
})
