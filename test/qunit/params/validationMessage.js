const { Swal, SwalWithoutAnimation, isVisible, TIMEOUT } = require('../helpers')

QUnit.test('input: email + validationMessage', (assert) => {
  const done = assert.async()

  SwalWithoutAnimation.fire({
    input: 'email',
    validationMessage: 'custom email validation message'
  })
  Swal.clickConfirm()
  setTimeout(() => {
    assert.ok(isVisible(Swal.getValidationMessage()))
    assert.equal(Swal.getValidationMessage().textContent, 'custom email validation message')
    done()
  }, TIMEOUT)
})

QUnit.test('input: url + validationMessage', (assert) => {
  const done = assert.async()

  SwalWithoutAnimation.fire({
    input: 'url',
    validationMessage: 'custom url validation message'
  })
  Swal.clickConfirm()
  setTimeout(() => {
    assert.ok(isVisible(Swal.getValidationMessage()))
    assert.equal(Swal.getValidationMessage().textContent, 'custom url validation message')
    done()
  }, TIMEOUT)
})
