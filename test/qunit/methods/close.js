const { Swal } = require('../helpers')

QUnit.test('close() method', (assert) => {
  const done = assert.async()

  Swal.fire({
    title: 'Swal.close() test'
  })

  Swal.close()
  assert.ok(Swal.getPopup().classList.contains('swal2-hide'))
  done()
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
  let onCloseCalled = false

  Swal.fire({
    title: 'onClose test',
    onClose: () => {
      // Here we test only that onClose is called
      // For more exahustive test on onClose see tests.js
      onCloseCalled = true
    }
  })

  Swal.close()
  assert.ok(onCloseCalled)
  done()
})

QUnit.test('onAfterClose using close() method', (assert) => {
  const done = assert.async()

  Swal.fire({
    title: 'onAfterClose test',
    animation: false,
    onAfterClose: () => {
      // Here we test only that onAfterClose is called
      // For more exahustive test on onAfterClose see tests.js
      clearTimeout(timer)
      assert.ok(true)
      done()
    }
  })

  // Set a timneout to check since onAfterClose is executed async
  let timer = setTimeout(() => {
    assert.ok(false, 'onAfterClose test timed out')
    done()
  }, 500)
  Swal.close()
})
