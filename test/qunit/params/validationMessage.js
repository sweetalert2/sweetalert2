const { Swal, SwalWithoutAnimation, isVisible, TIMEOUT } = require('../helpers')

QUnit.test('input: email + validationMessage', (assert) => {
  SwalWithoutAnimation({
    input: 'email',
    validationMessage: 'custom email validation message'
  })
  Swal.clickConfirm()
  setTimeout(() => {
    assert.ok(isVisible(Swal.getValidationError()))
    assert.equal(Swal.getValidationError().textContent, 'custom email validation message')
  }, TIMEOUT)
})

QUnit.test('input: url + validationMessage', (assert) => {
  SwalWithoutAnimation({
    input: 'url',
    validationMessage: 'custom url validation message'
  })
  Swal.clickConfirm()
  setTimeout(() => {
    assert.ok(isVisible(Swal.getValidationError()))
    assert.equal(Swal.getValidationError().textContent, 'custom url validation message')
  }, TIMEOUT)
})
