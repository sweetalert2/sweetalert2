const { Swal, SwalWithoutAnimation } = require('../helpers')

QUnit.test('close() method', (assert) => {
  Swal.fire({
    title: 'Swal.close() test'
  })

  Swal.close()
  assert.ok(Swal.getPopup().classList.contains('swal2-hide'))
})

QUnit.test('close() resolves to empty object', (assert) => {
  const done = assert.async()

  Swal.fire().then(result => {
    assert.deepEqual(result, {})
    done()
  })

  Swal.close()
})

QUnit.test('onClose using close() method', (assert) => {
  const done = assert.async()

  Swal.fire({
    onClose: () => {
      assert.ok(Swal.isVisible())
      done()
    }
  })

  Swal.close()
})

QUnit.test('onAfterClose using close() method', (assert) => {
  const done = assert.async()

  SwalWithoutAnimation.fire({
    onAfterClose: () => {
      assert.notOk(Swal.isVisible())
      done()
    }
  })

  Swal.close()
})

QUnit.test('Swal.fire() inside onAfterClose', (assert) => {
  const done = assert.async()

  SwalWithoutAnimation.fire({
    onAfterClose: () => {
      assert.notOk(Swal.isVisible())
      SwalWithoutAnimation.fire({
        input: 'text',
        onOpen: () => {
          assert.notDeepEqual(Swal.getInput(), null)
          done()
        }
      })
      assert.ok(Swal.isVisible())
    }
  })

  Swal.close()
})

QUnit.test('Swal.close() inside onAfterClose', (assert) => {
  const done = assert.async()

  Swal.fire({
    onAfterClose: () => {
      Swal.close()
      assert.notOk(Swal.isVisible())
      done()
    }
  })

  Swal.close()
})
