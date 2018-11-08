const { Swal, isVisible, TIMEOUT } = require('./helpers')

QUnit.test('input.checkValidity()', (assert) => {
  const done = assert.async()

  Swal({
    input: 'tel',
    inputAttributes: {
      pattern: '[0-9]{3}-[0-9]{3}-[0-9]{4}'
    },
    validationMessage: 'Invalid phone number'
  }).then(result => {
    assert.equal(result.value, '123-456-7890')
    done()
  })

  Swal.getInput().value = 'blah-blah'
  Swal.clickConfirm()
  setTimeout(() => {
    assert.ok(isVisible(Swal.getValidationMessage()))
    assert.equal(Swal.getValidationMessage().textContent, 'Invalid phone number')

    Swal.getInput().value = '123-456-7890'
    Swal.clickConfirm()
  }, TIMEOUT)
})
