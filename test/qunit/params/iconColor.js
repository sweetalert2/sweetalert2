const { Swal, SwalWithoutAnimation } = require('../helpers')

QUnit.test('iconColor', (assert) => {
  SwalWithoutAnimation.fire({
    icon: 'question',
    iconColor: 'red',
  })
  assert.equal(Swal.getIcon().style.color, 'red')
  assert.equal(Swal.getIcon().style.borderColor, 'red')
})
