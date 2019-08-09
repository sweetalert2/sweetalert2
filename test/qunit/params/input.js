const { $, Swal, SwalWithoutAnimation, isVisible, TIMEOUT, triggerKeydownEvent, dispatchCustomEvent, isIE } = require('../helpers')
const sinon = require('sinon/pkg/sinon')

QUnit.test('should throw console error about unexpected input type', (assert) => {
  const _consoleError = console.error
  const spy = sinon.spy(console, 'error')
  Swal.fire({ input: 'invalid-input-type' })
  console.error = _consoleError
  assert.ok(spy.calledWith('SweetAlert2: Unexpected type of input! Expected "text", "email", "password", "number", "tel", "select", "radio", "checkbox", "textarea", "file" or "url", got "invalid-input-type"'))
})

QUnit.test('input text', (assert) => {
  const done = assert.async()

  const string = 'Live for yourself'
  Swal.fire({
    input: 'text',
    inputClass: 'custom-input-class'
  }).then((result) => {
    assert.equal(result.value, string)
    assert.ok(Swal.getInput().classList.contains('custom-input-class'))
    done()
  })

  $('.swal2-input').value = string
  Swal.clickConfirm()
})

QUnit.test('input textarea', (assert) => {
  const done = assert.async()

  Swal.fire({
    input: 'textarea',
    inputAutoTrim: false
  }).then((result) => {
    assert.equal(result.value, 'hola!')
    done()
  })

  // Enter should not submit but put a newline to the textarea
  triggerKeydownEvent(Swal.getInput(), 'Enter')

  Swal.getInput().value = 'hola!'
  Swal.clickConfirm()
})

QUnit.test('input email + built-in email validation', (assert) => {
  const done = assert.async()

  const invalidEmailAddress = 'blah-blah@zzz'
  const validEmailAddress = 'team+support+a.b@example.com'
  SwalWithoutAnimation.fire({ input: 'email' }).then((result) => {
    assert.equal(result.value, validEmailAddress)
    done()
  })

  Swal.getInput().value = invalidEmailAddress
  Swal.clickConfirm()
  setTimeout(() => {
    assert.ok(isVisible(Swal.getValidationMessage()))
    assert.ok(Swal.getValidationMessage().textContent.indexOf('Invalid email address') !== -1)

    Swal.getInput().value = validEmailAddress
    triggerKeydownEvent(Swal.getInput(), 'Enter')
  }, TIMEOUT)
})

QUnit.test('input url + built-in url validation', (assert) => {
  const done = assert.async()

  const invalidUrl = 'sweetalert2.github.io'
  const validUrl = 'https://sweetalert2.github.io/'
  SwalWithoutAnimation.fire({ input: 'url' }).then((result) => {
    assert.equal(result.value, validUrl)
    done()
  })

  Swal.getInput().value = invalidUrl
  Swal.clickConfirm()
  setTimeout(() => {
    assert.ok(isVisible(Swal.getValidationMessage()))
    assert.ok(Swal.getValidationMessage().textContent.indexOf('Invalid URL') !== -1)

    Swal.getInput().value = validUrl
    triggerKeydownEvent(Swal.getInput(), 'Enter')
  }, TIMEOUT)
})

QUnit.test('input select', (assert) => {
  const done = assert.async()

  const selected = 'dos'
  Swal.fire({
    input: 'select',
    inputOptions: { uno: 1, dos: 2 },
    inputPlaceholder: 'Choose a number'
  }).then((result) => {
    assert.equal(result.value, selected)
    done()
  })

  assert.equal(Swal.getInput().value, '')

  const placeholderOption = Swal.getInput().querySelector('option')
  assert.ok(placeholderOption.disabled)
  assert.ok(placeholderOption.selected)
  assert.equal(placeholderOption.textContent, 'Choose a number')

  Swal.getInput().value = selected
  Swal.clickConfirm()
})

QUnit.test('input text w/ inputPlaceholder as configuration', (assert) => {
  const done = assert.async()

  Swal.fire({
    input: 'text',
    inputPlaceholder: 'placeholder text'
  })

  assert.equal(Swal.getInput().value, '')
  assert.equal(Swal.getInput().placeholder, 'placeholder text')

  done()
})

QUnit.test('input checkbox', (assert) => {
  const done = assert.async()

  Swal.fire({ input: 'checkbox', inputAttributes: { name: 'test-checkbox' } }).then((result) => {
    assert.equal(checkbox.getAttribute('name'), 'test-checkbox')
    assert.equal(result.value, '1')
    done()
  })

  const checkbox = $('.swal2-checkbox input')
  checkbox.checked = true
  Swal.clickConfirm()
})

QUnit.test('input range', (assert) => {
  Swal.fire({ input: 'range', inputAttributes: { min: 1, max: 10 }, inputValue: 5 })
  const input = Swal.getInput()
  const output = $('.swal2-range output')
  assert.equal(input.getAttribute('min'), '1')
  assert.equal(input.getAttribute('max'), '10')
  assert.equal(input.value, '5')

  if (!isIE) { // TODO (@limonte): make IE happy
    input.value = 10
    dispatchCustomEvent(input, 'input')
    assert.equal(output.textContent, '10')

    input.value = 9
    dispatchCustomEvent(input, 'change')
    assert.equal(output.textContent, '9')
  }
})

QUnit.test('input type "select", inputOptions Map', (assert) => {
  const inputOptions = new Map()
  inputOptions.set(2, 'Richard Stallman')
  inputOptions.set(1, 'Linus Torvalds')
  SwalWithoutAnimation.fire({
    input: 'select',
    inputOptions,
    inputValue: 1
  })
  assert.equal($('.swal2-select').querySelectorAll('option').length, 2)
  assert.equal($('.swal2-select option:nth-child(1)').innerHTML, 'Richard Stallman')
  assert.equal($('.swal2-select option:nth-child(1)').value, '2')
  assert.equal($('.swal2-select option:nth-child(2)').innerHTML, 'Linus Torvalds')
  assert.equal($('.swal2-select option:nth-child(2)').value, '1')
  assert.equal($('.swal2-select option:nth-child(2)').selected, true)
})

QUnit.test('input type "radio", inputOptions Map', (assert) => {
  const inputOptions = new Map()
  inputOptions.set(2, 'Richard Stallman')
  inputOptions.set(1, 'Linus Torvalds')
  Swal.fire({
    input: 'radio',
    inputOptions,
    inputValue: 1
  })
  assert.equal($('.swal2-radio').querySelectorAll('label').length, 2)
  assert.equal($('.swal2-radio label:nth-child(1)').textContent, 'Richard Stallman')
  assert.equal($('.swal2-radio label:nth-child(1) input').value, '2')
  assert.equal($('.swal2-radio label:nth-child(2)').textContent, 'Linus Torvalds')
  assert.equal($('.swal2-radio label:nth-child(2) input').value, '1')
  assert.equal($('.swal2-radio label:nth-child(2) input').checked, true)
})

QUnit.test('input radio', (assert) => {
  Swal.fire({
    input: 'radio',
    inputOptions: {
      one: 'one',
      two: 'two'
    }
  })

  assert.equal($('.swal2-radio').querySelectorAll('label').length, 2)
  assert.equal($('.swal2-radio').querySelectorAll('input[type="radio"]').length, 2)
})

QUnit.test('Swal.getInput() should be available in .then()', (assert) => {
  const done = assert.async()

  SwalWithoutAnimation.fire({
    input: 'text',
  }).then(() => {
    assert.ok(Swal.getInput())
    done()
  })
  Swal.close()
})

QUnit.test('Swal.getInput() should return null when a popup is disposed', (assert) => {
  const done = assert.async()

  SwalWithoutAnimation.fire({
    input: 'text',
    onAfterClose: () => {
      setTimeout(() => {
        assert.notOk(Swal.getInput())
        done()
      }, TIMEOUT)
    }
  })
  Swal.close()
})

QUnit.test('popup should expand and shrink accordingly to textarea width', (assert) => {
  const done = assert.async()
  SwalWithoutAnimation.fire({
    input: 'textarea',
  })
  Swal.getInput().style.width = '600px'
  setTimeout(() => {
    assert.equal(Swal.getPopup().style.width, '640px')

    Swal.getInput().style.width = '100px'
    setTimeout(() => {
      assert.equal(Swal.getPopup().style.width, '')
      done()
    })
  })
})
