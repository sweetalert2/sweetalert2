const { Swal } = require('../helpers')

QUnit.test('showClass + hideClass', (assert) => {
  const done = assert.async()

  Swal.fire({
    title: 'Custom animation with Animate.css',
    showClass: {
      popup: 'animated fadeInDown faster'
    },
    hideClass: {
      popup: 'animated fadeOutUp faster'
    },
    didClose: () => {
      assert.notOk(Swal.isVisible())
      done()
    }
  })
  Swal.close()
})
