const { Swal } = require('../helpers')

QUnit.test('Success icon with custom HTML', (assert) => {
  Swal.fire({
    icon: 'success',
    iconHtml: '<i class="fa fa-circle"></i>'
  })

  assert.equal(Swal.getIcon().innerHTML, '<div class="swal2-icon-content"><i class="fa fa-circle"></i></div>')
})
