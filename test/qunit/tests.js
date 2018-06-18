/* global QUnit */
const {Swal, SwalWithoutAnimation} = require('./helpers')
const $ = require('jquery')
const sinon = require('sinon')
import { triggerEscape, TIMEOUT } from './helpers.js'

QUnit.test('version is correct semver', (assert) => {
  assert.ok(Swal.version.match(/\d+\.\d+\.\d+/))
})

QUnit.test('modal shows up', (assert) => {
  Swal('Hello world!')
  assert.ok(Swal.isVisible())
})

QUnit.test('should throw console error about unexpected params', (assert) => {
  const _consoleError = console.error
  const spy = sinon.spy(console, 'error')
  Swal('Hello world!', {type: 'success'})
  console.error = _consoleError
  assert.ok(spy.calledWith('SweetAlert2: Unexpected type of html! Expected "string", got object'))
})

QUnit.test('modal width', (assert) => {
  Swal({text: '300px', width: 300})
  assert.equal($('.swal2-modal')[0].style.width, '300px')

  Swal({text: '400px', width: '400px'})
  assert.equal($('.swal2-modal')[0].style.width, '400px')

  Swal({text: '90%', width: '90%'})
  assert.equal($('.swal2-modal')[0].style.width, '90%')
})

QUnit.test('heightAuto', (assert) => {
  Swal('I should set .swal2-height-auto class to html and body')
  assert.ok(document.documentElement.classList.contains('swal2-height-auto'))

  Swal({
    title: 'I am modeless and should not set .swal2-height-auto',
    backdrop: false
  })
  assert.ok(document.documentElement.classList.contains('swal2-height-auto'))

  Swal({
    title: 'I am toast and should not set .swal2-height-auto',
    toast: true
  })
  assert.ok(document.documentElement.classList.contains('swal2-height-auto'))
})

QUnit.test('custom class', (assert) => {
  Swal({customClass: 'custom-class'})
  assert.ok(Swal.getPopup().classList.contains('custom-class'))
})

QUnit.test('getters', (assert) => {
  Swal('Title', 'Content')
  assert.equal(Swal.getTitle().innerText, 'Title')
  assert.equal(Swal.getContent().innerText.trim(), 'Content')

  Swal({
    showCancelButton: true,
    imageUrl: '/assets/swal2-logo.png',
    confirmButtonText: 'Confirm button',
    confirmButtonAriaLabel: 'Confirm button aria-label',
    cancelButtonText: 'Cancel button',
    cancelButtonAriaLabel: 'Cancel button aria-label',
    footer: '<b>Footer</b>'
  })
  assert.ok(Swal.getImage().src.indexOf('/assets/swal2-logo.png'))
  assert.equal(Swal.getActions().textContent, 'Confirm buttonCancel button')
  assert.equal(Swal.getConfirmButton().innerText, 'Confirm button')
  assert.equal(Swal.getCancelButton().innerText, 'Cancel button')
  assert.equal(Swal.getConfirmButton().getAttribute('aria-label'), 'Confirm button aria-label')
  assert.equal(Swal.getCancelButton().getAttribute('aria-label'), 'Cancel button aria-label')
  assert.equal(Swal.getFooter().innerHTML, '<b>Footer</b>')

  Swal({input: 'text'})
  $('.swal2-input').val('input text')
  assert.equal(Swal.getInput().value, 'input text')

  Swal({
    input: 'radio',
    inputOptions: {
      'one': 'one',
      'two': 'two'
    }
  })
  $('.swal2-radio input[value="two"]').prop('checked', true)
  assert.equal(Swal.getInput().value, 'two')
})

QUnit.test('custom buttons classes', (assert) => {
  Swal({
    text: 'Modal with custom buttons classes',
    confirmButtonClass: 'btn btn-success ',
    cancelButtonClass: 'btn btn-warning '
  })
  assert.ok($('.swal2-confirm').hasClass('btn'))
  assert.ok($('.swal2-confirm').hasClass('btn-success'))
  assert.ok($('.swal2-cancel').hasClass('btn'))
  assert.ok($('.swal2-cancel').hasClass('btn-warning'))

  Swal('Modal with default buttons classes')
  assert.notOk($('.swal2-confirm').hasClass('btn'))
  assert.notOk($('.swal2-confirm').hasClass('btn-success'))
  assert.notOk($('.swal2-cancel').hasClass('btn'))
  assert.notOk($('.swal2-cancel').hasClass('btn-warning'))
})

QUnit.test('content/title is set (html)', (assert) => {
  Swal({
    title: '<strong>Strong</strong>, <em>Emphasis</em>',
    html: '<p>Paragraph</p><img /><button></button>'
  })

  assert.equal($('strong, em', '.swal2-title').length, 2)
  assert.equal($('p, img, button', '.swal2-content').length, 3)
})

QUnit.test('content/title is set (text)', (assert) => {
  Swal({
    titleText: '<strong>Strong</strong>, <em>Emphasis</em>',
    text: '<p>Paragraph</p><img /><button></button>'
  })

  assert.equal($('.swal2-title').text(), '<strong>Strong</strong>, <em>Emphasis</em>')
  assert.equal($('.swal2-content').text(), '<p>Paragraph</p><img /><button></button>')
  assert.equal($('strong, em', '.swal2-title').length, 0)
  assert.equal($('p, img, button', '.swal2-content').length, 0)
})

QUnit.test('jQuery/js element as html param', (assert) => {
  Swal({
    html: $('<p>jQuery element</p>')
  })
  assert.equal($('#swal2-content').html(), '<p>jQuery element</p>')

  const p = document.createElement('p')
  p.textContent = 'js element'
  Swal({
    html: p
  })
  assert.equal($('#swal2-content').html(), '<p>js element</p>')
})

QUnit.test('set and reset defaults', (assert) => {
  Swal.setDefaults({confirmButtonText: 'Next >', showCancelButton: true})
  Swal('Modal with changed defaults')
  assert.equal($('.swal2-confirm').text(), 'Next >')
  assert.ok($('.swal2-cancel').is(':visible'))

  Swal.resetDefaults()
  Swal('Modal after resetting defaults')
  assert.equal($('.swal2-confirm').text(), 'OK')
  assert.ok($('.swal2-cancel').is(':hidden'))

  Swal.clickCancel()
})

QUnit.test('should throw console error about unexpected input type', (assert) => {
  const _consoleError = console.error
  const spy = sinon.spy(console, 'error')
  Swal({input: 'invalid-input-type'})
  console.error = _consoleError
  assert.ok(spy.calledWith('SweetAlert2: Unexpected type of input! Expected "text", "email", "password", "number", "tel", "select", "radio", "checkbox", "textarea", "file" or "url", got "invalid-input-type"'))
})

QUnit.test('input text', (assert) => {
  const done = assert.async()

  const string = 'Live for yourself'
  Swal({input: 'text'}).then((result) => {
    assert.equal(result.value, string)
    done()
  })

  $('.swal2-input').val(string)
  Swal.clickConfirm()
})

QUnit.test('custom validation message', (assert) => {
  const done = assert.async()
  Swal({
    input: 'email',
    extraParams: {
      validationMessage: 'Adresse e-mail invalide'
    }
  })

  $('.swal2-input').val('invalid-email')
  Swal.clickConfirm()

  setTimeout(() => {
    assert.ok($('.swal2-validationerror').is(':visible'))
    assert.equal($('.swal2-validationerror').text(), 'Adresse e-mail invalide')
    done()
  }, TIMEOUT)
})

QUnit.test('validation error', (assert) => {
  const done = assert.async()
  const inputValidator = (value) => Promise.resolve(!value && 'no falsy values')

  SwalWithoutAnimation({input: 'text', inputValidator})
  assert.ok($('.swal2-validationerror').is(':hidden'))
  setTimeout(() => {
    const initialModalHeight = $('.swal2-modal').outerHeight()

    Swal.clickConfirm()
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
    }, TIMEOUT)
  }, TIMEOUT)
})

QUnit.test('built-in email validation', (assert) => {
  const done = assert.async()

  var validEmailAddress = 'team+support+a.b@example.com'
  Swal({input: 'email'}).then((result) => {
    assert.equal(result.value, validEmailAddress)
    done()
  })

  $('.swal2-input').val(validEmailAddress)
  Swal.clickConfirm()
})

QUnit.test('input select', (assert) => {
  const done = assert.async()

  const selected = 'dos'
  Swal({
    input: 'select',
    inputOptions: {uno: 1, dos: 2}
  }).then((result) => {
    assert.equal(result.value, selected)
    done()
  })

  $('.swal2-select').val(selected)
  Swal.clickConfirm()
})

QUnit.test('should throw console error about unexpected type of InputOptions', (assert) => {
  const _consoleError = console.error
  const spy = sinon.spy(console, 'error')
  Swal({input: 'select', inputOptions: 'invalid-input-options'})
  console.error = _consoleError
  assert.ok(spy.calledWith('SweetAlert2: Unexpected type of inputOptions! Expected object, Map or Promise, got string'))
})

QUnit.test('input checkbox', (assert) => {
  const done = assert.async()

  Swal({input: 'checkbox', inputAttributes: {name: 'test-checkbox'}}).then((result) => {
    assert.equal(checkbox.attr('name'), 'test-checkbox')
    assert.equal(result.value, '1')
    done()
  })

  const checkbox = $('.swal2-checkbox input')
  checkbox.prop('checked', true)
  Swal.clickConfirm()
})

QUnit.test('input range', (assert) => {
  Swal({input: 'range', inputAttributes: {min: 1, max: 10}, inputValue: 5})
  const input = $('.swal2-range input')
  assert.equal(input.attr('min'), '1')
  assert.equal(input.attr('max'), '10')
  assert.equal(input.val(), '5')
})

if (typeof Map !== 'undefined') { // There's no Map in Adroid 4.4 - skip tests
  QUnit.test('input type "select", inputOptions Map', (assert) => {
    const inputOptions = new Map()
    inputOptions.set(2, 'Richard Stallman')
    inputOptions.set(1, 'Linus Torvalds')
    SwalWithoutAnimation({
      input: 'select',
      inputOptions,
      inputValue: 1
    })
    assert.equal($('.swal2-select option').length, 2)
    assert.equal($('.swal2-select option')[0].innerHTML, 'Richard Stallman')
    assert.equal($('.swal2-select option')[0].value, '2')
    assert.equal($('.swal2-select option')[1].innerHTML, 'Linus Torvalds')
    assert.equal($('.swal2-select option')[1].value, '1')
    assert.equal($('.swal2-select option')[1].selected, true)
  })

  QUnit.test('input type "radio", inputOptions Map', (assert) => {
    const inputOptions = new Map()
    inputOptions.set(2, 'Richard Stallman')
    inputOptions.set(1, 'Linus Torvalds')
    Swal({
      input: 'radio',
      inputOptions,
      inputValue: 1
    })
    assert.equal($('.swal2-radio label').length, 2)
    assert.equal($('.swal2-radio label')[0].textContent, 'Richard Stallman')
    assert.equal($('.swal2-radio input')[0].value, '2')
    assert.equal($('.swal2-radio label')[1].textContent, 'Linus Torvalds')
    assert.equal($('.swal2-radio input')[1].value, '1')
    assert.equal($('.swal2-radio input')[1].checked, true)
  })
}

QUnit.test('queue', (assert) => {
  const done = assert.async()
  const steps = ['Step 1', 'Step 2']

  assert.equal(Swal.getQueueStep(), null)

  SwalWithoutAnimation.queue(steps).then(() => {
    SwalWithoutAnimation('All done!')
  })

  assert.equal($('.swal2-modal h2').text(), 'Step 1')
  assert.equal(Swal.getQueueStep(), 0)
  SwalWithoutAnimation.clickConfirm()

  setTimeout(() => {
    assert.equal($('.swal2-modal h2').text(), 'Step 2')
    assert.equal(Swal.getQueueStep(), 1)
    SwalWithoutAnimation.clickConfirm()

    setTimeout(() => {
      assert.equal($('.swal2-modal h2').text(), 'All done!')
      assert.equal(SwalWithoutAnimation.getQueueStep(), null)
      SwalWithoutAnimation.clickConfirm()

      // test queue is cancelled on first step, other steps shouldn't be shown
      SwalWithoutAnimation.queue(steps)
      SwalWithoutAnimation.clickCancel()
      assert.notOk(SwalWithoutAnimation.isVisible())
      done()
    }, TIMEOUT)
  }, TIMEOUT)
})

QUnit.test('dymanic queue', (assert) => {
  const done = assert.async()
  const steps = [
    {
      title: 'Step 1',
      preConfirm: () => {
        return new Promise((resolve) => {
          // insert to the end by default
          Swal.insertQueueStep('Step 3')
          // step to be deleted
          Swal.insertQueueStep('Step to be deleted')
          // insert with positioning
          Swal.insertQueueStep({
            title: 'Step 2',
            preConfirm: () => {
              return new Promise((resolve) => {
                Swal.deleteQueueStep(3)
                resolve()
              })
            }
          }, 1)
          resolve()
        })
      }
    }
  ]

  Swal.setDefaults({animation: false})
  setTimeout(() => {
    Swal.queue(steps).then(() => {
      Swal('All done!')
    })

    assert.equal($('.swal2-modal h2').text(), 'Step 1')
    Swal.clickConfirm()

    setTimeout(() => {
      assert.equal($('.swal2-modal h2').text(), 'Step 2')
      assert.equal(Swal.getQueueStep(), 1)
      Swal.clickConfirm()

      setTimeout(() => {
        assert.equal($('.swal2-modal h2').text(), 'Step 3')
        assert.equal(Swal.getQueueStep(), 2)
        Swal.clickConfirm()

        setTimeout(() => {
          assert.equal($('.swal2-modal h2').text(), 'All done!')
          assert.equal(Swal.getQueueStep(), null)
          Swal.clickConfirm()
          done()
        }, TIMEOUT)
      }, TIMEOUT)
    }, TIMEOUT)
  }, TIMEOUT)
})

QUnit.test('showLoading and hideLoading', (assert) => {
  Swal.showLoading()
  assert.ok($('.swal2-actions').hasClass('swal2-loading'))
  assert.ok($('.swal2-cancel').is(':disabled'))

  Swal.hideLoading()
  assert.notOk($('.swal2-actions').hasClass('swal2-loading'))
  assert.notOk($('.swal2-cancel').is(':disabled'))

  Swal({
    title: 'test loading state',
    showConfirmButton: false
  })

  Swal.showLoading()
  assert.ok($('.swal2-actions').is(':visible'))
  assert.ok($('.swal2-actions').hasClass('swal2-loading'))

  Swal.hideLoading()
  assert.notOk($('.swal2-actions').is(':visible'))
  assert.notOk($('.swal2-actions').hasClass('swal2-loading'))
})

QUnit.test('disable/enable buttons', (assert) => {
  Swal('test disable/enable buttons')

  Swal.disableButtons()
  assert.ok($('.swal2-confirm').is(':disabled'))
  assert.ok($('.swal2-cancel').is(':disabled'))

  Swal.enableButtons()
  assert.notOk($('.swal2-confirm').is(':disabled'))
  assert.notOk($('.swal2-cancel').is(':disabled'))

  Swal.disableConfirmButton()
  assert.ok($('.swal2-confirm').is(':disabled'))

  Swal.enableConfirmButton()
  assert.notOk($('.swal2-confirm').is(':disabled'))
})

QUnit.test('input radio', (assert) => {
  Swal({
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
  Swal({
    input: 'text'
  })

  Swal.disableInput()
  assert.ok($('.swal2-input').is(':disabled'))
  Swal.enableInput()
  assert.notOk($('.swal2-input').is(':disabled'))

  Swal({
    input: 'radio',
    inputOptions: {
      'one': 'one',
      'two': 'two'
    }
  })

  Swal.disableInput()
  $('.swal2-radio radio').each((radio) => {
    assert.ok(radio.is(':disabled'))
  })
  Swal.enableInput()
  $('.swal2-radio radio').each((radio) => {
    assert.notOk(radio.is(':disabled'))
  })
})

QUnit.test('default focus', (assert) => {
  const done = assert.async()

  SwalWithoutAnimation('Modal with the Confirm button only')
  assert.ok(document.activeElement === document.querySelector('.swal2-confirm'))

  SwalWithoutAnimation({
    text: 'Modal with two buttons',
    showCancelButton: true
  })
  assert.ok(document.activeElement === document.querySelector('.swal2-confirm'))

  SwalWithoutAnimation({
    text: 'Modal with no focusable elements in it',
    showConfirmButton: false
  })
  assert.ok(document.activeElement === document.querySelector('.swal2-modal'))

  SwalWithoutAnimation({
    text: 'Modal with an input',
    input: 'text',
    onOpen: () => {
      assert.ok(document.activeElement === document.querySelector('.swal2-input'))
      done()
    }
  })
})

QUnit.test('reversed buttons', (assert) => {
  Swal({
    text: 'Modal with reversed buttons',
    reverseButtons: true
  })
  assert.ok($('.swal2-confirm').index() - $('.swal2-cancel').index() === 1)

  Swal('Modal with buttons')
  assert.ok($('.swal2-cancel').index() - $('.swal2-confirm').index() === 1)
})

QUnit.test('focusConfirm', (assert) => {
  Swal({
    showCancelButton: true
  })
  assert.ok(document.activeElement === $('.swal2-confirm')[0])

  const anchor = $('<a href>link</a>')
  Swal({
    html: anchor,
    showCancelButton: true,
    focusConfirm: false
  })
  assert.ok(document.activeElement.outerHTML === anchor[0].outerHTML)
})

QUnit.test('focusCancel', (assert) => {
  Swal({
    text: 'Modal with Cancel button focused',
    showCancelButton: true,
    focusCancel: true
  })
  assert.ok(document.activeElement === $('.swal2-cancel')[0])
})

QUnit.test('image alt text and custom class', (assert) => {
  Swal({
    text: 'Custom class is set',
    imageUrl: '/assets/swal2-logo.png',
    imageAlt: 'Custom icon',
    imageClass: 'image-custom-class'
  })
  assert.ok($('.swal2-image').hasClass('image-custom-class'))
  assert.equal($('.swal2-image').attr('alt'), 'Custom icon')

  Swal({
    text: 'Custom class isn\'t set',
    imageUrl: '/assets/swal2-logo.png'
  })
  assert.notOk($('.swal2-image').hasClass('image-custom-class'))
})

QUnit.test('modal vertical offset', (assert) => {
  const done = assert.async(1)
  // create a modal with dynamic-height content
  SwalWithoutAnimation({
    imageUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNikAQAACIAHF/uBd8AAAAASUVORK5CYII=',
    title: 'Title',
    html: '<hr><div style="height: 50px"></div><p>Text content</p>',
    type: 'warning',
    input: 'text'
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
  Swal('Default target')
  assert.equal(document.body, document.querySelector('.swal2-container').parentNode)
  Swal.close()

  const dummyTargetElement = Object.assign(document.createElement('div'), {id: 'dummy-target'})
  document.body.appendChild(dummyTargetElement)

  Swal({title: 'Custom valid target (string)', target: '#dummy-target'}) // switch targets
  assert.equal(document.querySelector('.swal2-container').parentNode, dummyTargetElement)
  Swal.close()

  Swal({title: 'Custom invalid target (string)', target: 'lorem_ipsum'}) // switch targets
  assert.equal(document.querySelector('.swal2-container').parentNode, document.body)
  Swal.close()

  Swal({title: 'Custom valid target (element)', target: dummyTargetElement})
  assert.equal(document.querySelector('.swal2-container').parentNode, dummyTargetElement)
  Swal.close()

  Swal({title: 'Custom invalid target (element)', target: true})
  assert.equal(document.body, document.querySelector('.swal2-container').parentNode)
  Swal.close()
  console.warn = warn // Suppress the warnings
})

QUnit.test('onOpen', (assert) => {
  const done = assert.async()

  // create a modal with an onOpen callback
  Swal({
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
  Swal({
    title: 'onBeforeOpen test',
    onBeforeOpen: ($modal) => {
      assert.ok($('.swal2-modal').is($modal))
    }
  })

  // check that onBeforeOpen calls properly
  const dynamicTitle = 'Set onBeforeOpen title'
  Swal({
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

QUnit.test('onAfterClose', (assert) => {
  const done = assert.async()
  let onCloseFinished = false

  // create a modal with an onAfterClose callback
  Swal({
    title: 'onAfterClose test',
    onClose: () => {
      onCloseFinished = true
    },
    onAfterClose: () => {
      assert.ok(onCloseFinished)
      assert.ok(!$('.swal2-container').length)
      done()
    }
  })

  $('.swal2-close').click()
})

QUnit.test('onClose', (assert) => {
  const done = assert.async()

  // create a modal with an onClose callback
  Swal({
    title: 'onClose test',
    onClose: (_$modal) => {
      assert.ok($modal.is(_$modal))
      assert.ok($('.swal2-container').length)
      done()
    }
  })

  const $modal = $('.swal2-modal')
  $('.swal2-close').click()
})

QUnit.test('esc key', (assert) => {
  const done = assert.async()

  document.body.addEventListener('keydown', (e) => {
    throw new Error('Should not propagate keydown event to body!')
  })

  SwalWithoutAnimation({
    title: 'Esc me',
    onOpen: triggerEscape
  }).then((result) => {
    assert.deepEqual(result, {dismiss: Swal.DismissReason.esc})
    done()
  })
})

QUnit.test('allowEscapeKey as a function', (assert) => {
  const done = assert.async()

  let functionWasCalled = false

  SwalWithoutAnimation({
    title: 'allowEscapeKey as a function',
    allowEscapeKey: () => {
      functionWasCalled = true
      return false
    },
    onOpen: (popup) => {
      assert.equal(functionWasCalled, false)

      triggerEscape()

      setTimeout(() => {
        assert.equal(functionWasCalled, true)
        assert.ok(Swal.isVisible())

        done()
      })
    }
  })
})

QUnit.test('close button', (assert) => {
  const done = assert.async()

  Swal({
    title: 'Close button test',
    showCloseButton: true
  }).then((result) => {
    assert.deepEqual(result, {dismiss: Swal.DismissReason.close})
    done()
  })

  const $closeButton = $('.swal2-close')
  assert.ok($closeButton.is(':visible'))
  assert.equal($closeButton.attr('aria-label'), 'Close this dialog')
  $closeButton.click()
})
QUnit.test('cancel button', (assert) => {
  const done = assert.async()

  Swal({
    title: 'Cancel me'
  }).then((result) => {
    assert.deepEqual(result, {dismiss: Swal.DismissReason.cancel})
    done()
  })

  Swal.clickCancel()
})

QUnit.test('timer', (assert) => {
  const done = assert.async()

  SwalWithoutAnimation({
    title: 'Timer test',
    timer: 10
  }).then((result) => {
    assert.deepEqual(result, {dismiss: Swal.DismissReason.timer})
    done()
  })
})

QUnit.test('getTimerLeft()', (assert) => {
  const done = assert.async()

  SwalWithoutAnimation('swal without timer')
  assert.equal(Swal.getTimerLeft(), undefined)
  SwalWithoutAnimation({title: 'swal with 100ms timer', timer: 20})
  assert.ok(Swal.getTimerLeft() < 20)
  assert.ok(Swal.getTimerLeft() > 0)
  setTimeout(() => {
    assert.equal(Swal.getTimerLeft(), undefined)
    done()
  }, 20)
})

QUnit.test('confirm button', (assert) => {
  const done = assert.async()
  Swal({
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
  Swal.clickConfirm()
})

QUnit.test('on errors in *async* user-defined functions, cleans up and propagates the error', (assert) => {
  const done = assert.async()

  const expectedError = new Error('my bad')
  const erroringFunction = () => {
    return Promise.reject(expectedError)
  }

  // inputValidator
  const rejectedPromise = Swal({input: 'text', expectRejections: false, inputValidator: erroringFunction})
  Swal.clickConfirm()
  rejectedPromise.catch((error) => {
    assert.equal(error, expectedError) // error is bubbled up back to user code
    setTimeout(() => {
      assert.notOk(Swal.isVisible()) // display is cleaned up

      // preConfirm
      const rejectedPromise = Swal({expectRejections: false, preConfirm: erroringFunction})
      Swal.clickConfirm()
      rejectedPromise.catch((error) => {
        assert.equal(error, expectedError) // error is bubbled up back to user code
        setTimeout(() => {
          assert.notOk(Swal.isVisible()) // display is cleaned up

          done()
        })
      })
    })
  })
})

QUnit.test('params validation', (assert) => {
  assert.ok(Swal.isValidParameter('title'))
  assert.notOk(Swal.isValidParameter('foobar'))
})

QUnit.test('addition and removal of backdrop', (assert) => {
  Swal({backdrop: false})
  assert.ok(document.body.classList.contains('swal2-no-backdrop'))
  assert.ok(document.documentElement.classList.contains('swal2-no-backdrop'))
  Swal({title: 'test'})
  assert.notOk(document.body.classList.contains('swal2-no-backdrop'))
  assert.notOk(document.documentElement.classList.contains('swal2-no-backdrop'))
})

QUnit.test('footer', (assert) => {
  Swal({title: 'Modal with footer', footer: 'I am footer'})
  assert.ok($('.swal2-footer').is(':visible'))

  Swal('Modal w/o footer')
  assert.notOk($('.swal2-footer').is(':visible'))
})

QUnit.test('null values', (assert) => {
  const defaultParams = require('../../src/utils/params').default
  const params = {}
  Object.keys(defaultParams).forEach(key => {
    params[key] = null
  })
  Swal(params)
  assert.ok(Swal.isVisible())
})

QUnit.test('backdrop accepts css background param', (assert) => {
  let backdrop = 'rgb(123, 123, 123)'
  Swal({
    title: 'I have no backdrop',
    backdrop: false
  })
  assert.notOk($('.swal2-container')[0].style.background)

  Swal({
    title: 'I have a custom backdrop',
    backdrop: backdrop
  })
  assert.ok($('.swal2-container')[0].style.background.includes(backdrop))
})

QUnit.test('preConfirm return false', (assert) => {
  SwalWithoutAnimation({
    preConfirm: () => {
      return false
    }
  })

  Swal.clickConfirm()
  assert.ok(Swal.isVisible())
})

QUnit.test('animation param evaluates a function', (assert) => {
  Swal({
    animation: () => false
  })
  assert.ok($('.swal2-popup').hasClass('swal2-noanimation'))

  Swal({
    animation: () => true
  })
  assert.notOk($('.swal2-popup').hasClass('swal2-noanimation'))
})

QUnit.test('Custom content', (assert) => {
  const done = assert.async()
  Swal({
    showCancelButton: true,
    onOpen: () => {
      Swal.getContent().textContent = 'Custom content'
      Swal.clickConfirm()
    },
    preConfirm: () => {
      return 'Some data from custom control'
    }
  }).then(result => {
    assert.ok(result.value)
    done()
  })
})

QUnit.test('inputValue as a Promise', (assert) => {
  const inputTypes = ['text', 'email', 'number', 'tel', 'textarea']
  const done = assert.async(inputTypes.length)
  const value = '1.1 input value'
  const inputValue = new Promise((resolve, reject) => {
    resolve('1.1 input value')
  })
  inputTypes.forEach(input => {
    SwalWithoutAnimation({
      input,
      inputValue,
      onOpen: (modal) => {
        setTimeout(() => {
          const inputEl = input === 'textarea' ? modal.querySelector('.swal2-textarea') : modal.querySelector('.swal2-input')
          assert.equal(inputEl.value, input === 'number' ? parseFloat(value) : value)
          done()
        }, TIMEOUT)
      }
    })
  })
})
