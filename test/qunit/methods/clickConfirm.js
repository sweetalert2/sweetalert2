const { $, Swal, SwalWithoutAnimation } = require('../helpers')

QUnit.test('clickConfirm() should click the confirm button', (assert) => {
  const done = assert.async()
  Swal.fire({
    input: 'radio',
    inputOptions: {
      one: 'one',
      two: 'two'
    }
  }).then((result) => {
    assert.deepEqual(result, {
      value: 'two',
      isConfirmed: true,
      isDenied: false,
      isDismissed: false,
    })
    done()
  })
  $('.swal2-radio').querySelector('input[value="two"]').checked = true
  Swal.clickConfirm()
})

QUnit.test('clickConfirm() should not fail if a popup is not visible', (assert) => {
  SwalWithoutAnimation.fire()
  Swal.close()
  assert.notOk(Swal.isVisible())
  Swal.clickConfirm()
})
