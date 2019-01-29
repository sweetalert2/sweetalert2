const { Swal } = require('../helpers')

QUnit.test('close() method', (assert) => {
  Swal.fire({
    title: 'Swal.close() test'
  })

  Swal.close()
  assert.ok(Swal.getPopup().classList.contains('swal2-hide'))
})

QUnit.test('close() resolves to empty object', (assert) => {
  const done = assert.async()

  Swal.fire({
    title: 'Swal.close() test'
  }).then(result => {
    assert.deepEqual(result, {})
    done()
  })

  Swal.close()
})

QUnit.test('onClose using close() method', (assert) => {
  const done = assert.async()

  Swal.fire({
    title: 'onClose test',
    onClose: () => {
      assert.ok(Swal.isVisible())
      done()
    }
  })

  Swal.close()
})

QUnit.test('onAfterClose using close() method', (assert) => {
  const done = assert.async()

  Swal.fire({
    title: 'onAfterClose test',
    animation: false,
    onAfterClose: () => {
      assert.notOk(Swal.isVisible())
      done()
    }
  })

  Swal.close()
})
