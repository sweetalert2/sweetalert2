const { Swal, SwalWithoutAnimation } = require('../helpers')

QUnit.test('close() method', (assert) => {
  Swal.fire({
    title: 'Swal.close() test'
  })

  Swal.close()
  assert.ok(Swal.getPopup().classList.contains('swal2-hide'))
})

QUnit.test('Swal.close() resolves', (assert) => {
  const done = assert.async()

  Swal.fire().then(result => {
    assert.deepEqual(result, {
      isConfirmed: false,
      isDenied: false,
      isDismissed: true,
    })
    done()
  })

  Swal.close()
})

QUnit.test('willClose using close() method', (assert) => {
  const done = assert.async()

  Swal.fire({
    willClose: () => {
      assert.ok(Swal.isVisible())
      done()
    }
  })

  Swal.close()
})

QUnit.test('didClose using close() method', (assert) => {
  const done = assert.async()

  SwalWithoutAnimation.fire({
    didClose: () => {
      assert.notOk(Swal.isVisible())
      done()
    }
  })

  Swal.close()
})

QUnit.test('Swal.fire() inside didClose', (assert) => {
  const done = assert.async()

  SwalWithoutAnimation.fire({
    didClose: () => {
      assert.notOk(Swal.isVisible())
      SwalWithoutAnimation.fire({
        input: 'text',
        didOpen: () => {
          assert.notDeepEqual(Swal.getInput(), null)
          done()
        }
      })
      assert.ok(Swal.isVisible())
    }
  })

  Swal.close()
})

QUnit.test('Swal.close() inside didClose', (assert) => {
  const done = assert.async()

  Swal.fire({
    didClose: () => {
      Swal.close()
      assert.notOk(Swal.isVisible())
      done()
    }
  })

  Swal.close()
})
