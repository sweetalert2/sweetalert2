const { Swal, SwalWithoutAnimation } = require('./helpers')

QUnit.test('container should have .swal2-rtl in case of <body dir="rtl">', (assert) => {
  document.body.setAttribute('dir', 'rtl')
  SwalWithoutAnimation('hi')
  assert.ok(Swal.getContainer().classList.contains('swal2-rtl'))
})

QUnit.test('container should have .swal2-rtl in case of <body style="direction: rtl">', (assert) => {
  document.body.style.direction = 'rtl'
  SwalWithoutAnimation('hi')
  assert.ok(Swal.getContainer().classList.contains('swal2-rtl'))
})
