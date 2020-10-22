const { Swal, SwalWithoutAnimation } = require('../helpers')

QUnit.test('preConfirm return false', (assert) => {
  SwalWithoutAnimation.fire({
    preConfirm: () => false,
  })

  Swal.clickConfirm()
  assert.ok(Swal.isVisible())
})

QUnit.test('preConfirm custom value', (assert) => {
  const done = assert.async()
  SwalWithoutAnimation.fire({
    preConfirm: () => 'Some data from preConfirm',
  }).then(result => {
    assert.equal('Some data from preConfirm', result.value)
    done()
  })
  Swal.clickConfirm()
})

QUnit.test('preConfirm returns 0', (assert) => {
  const done = assert.async()
  SwalWithoutAnimation.fire({
    preConfirm: () => 0
  }).then(result => {
    assert.equal(result.value, 0)
    done()
  })
  Swal.clickConfirm()
})

QUnit.test('preConfirm returns object containing toPromise', (assert) => {
  const done = assert.async()
  SwalWithoutAnimation.fire({
    didOpen: () => Swal.clickConfirm(),
    preConfirm: () => ({
      toPromise: () => Promise.resolve(0)
    })
  }).then(result => {
    assert.equal(result.value, 0)
    done()
  })
})
