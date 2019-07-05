const { Swal } = require('../helpers')

QUnit.test('padding should allow 0', (assert) => {
  Swal.fire({
    padding: 0,
  })
  assert.equal(Swal.getPopup().style.padding, '0px')
})

QUnit.test('padding should allow a number', (assert) => {
  Swal.fire({
    padding: 15,
  })
  assert.equal(Swal.getPopup().style.padding, '15px')
})

QUnit.test('padding should allow a string', (assert) => {
  Swal.fire({
    padding: '2rem',
  })
  assert.equal(Swal.getPopup().style.padding, '2rem')
})

QUnit.test('padding should be empty with undefined', (assert) => {
  Swal.fire({
    padding: undefined,
  })
  assert.equal(Swal.getPopup().style.padding, '')
})

QUnit.test('padding should be empty with an object', (assert) => {
  Swal.fire({
    padding: {},
  })
  assert.equal(Swal.getPopup().style.padding, '')
})

QUnit.test('padding should be empty with an array', (assert) => {
  Swal.fire({
    padding: [],
  })
  assert.equal(Swal.getPopup().style.padding, '')
})

QUnit.test('padding should be empty with `true`', (assert) => {
  Swal.fire({
    padding: true,
  })
  assert.equal(Swal.getPopup().style.padding, '')
})
