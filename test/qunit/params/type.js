const { Swal, isVisible, isHidden } = require('../helpers')
const sinon = require('sinon/pkg/sinon')

QUnit.test('should throw console error about invalid icon', (assert) => {
  const _consoleError = console.error
  const spy = sinon.spy(console, 'error')
  Swal.fire({
    icon: 'invalid-icon'
  })
  console.error = _consoleError
  assert.ok(spy.calledWith('SweetAlert2: Unknown icon! Expected "success", "error", "warning", "info" or "question", got "invalid-icon"'))

  // should behave the same way as empty object would be passed
  assert.ok(isVisible(Swal.getConfirmButton()))
  assert.ok(isHidden(Swal.getCancelButton()))
  assert.equal(Swal.getTitle().textContent, '')
  assert.equal(Swal.getContent().textContent, '')
  assert.ok(isHidden(Swal.getFooter()))
})
