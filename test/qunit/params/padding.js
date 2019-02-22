const { Swal } = require('../helpers')

QUnit.test('padding = 0', (assert) => {
  Swal.fire({
    padding: 0,
  })
  assert.equal(Swal.getPopup().style.padding, '0px')
})

QUnit.test('padding as a number', (assert) => {
  Swal.fire({
    padding: 15,
  })
  assert.equal(Swal.getPopup().style.padding, '15px')
})

QUnit.test('padding as a string', (assert) => {
  Swal.fire({
    padding: '2rem',
  })
  assert.equal(Swal.getPopup().style.padding, '2rem')
})