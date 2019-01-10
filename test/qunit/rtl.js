const { Swal, SwalWithoutAnimation } = require('./helpers')

QUnit.test('container should have .swal2-rtl in case of <body dir="rtl">', (assert) => {
  document.body.setAttribute('dir', 'rtl')
  SwalWithoutAnimation.fire('hi')
  assert.ok(Swal.getContainer().classList.contains('swal2-rtl'))
})

QUnit.test('container should have .swal2-rtl in case of <body style="direction: rtl">', (assert) => {
  document.body.style.direction = 'rtl'
  SwalWithoutAnimation.fire('hi')
  assert.ok(Swal.getContainer().classList.contains('swal2-rtl'))
})

QUnit.test('container should have .swal2-rtl in case of <div dir="rtl">', (assert) => {
  const targetDiv = document.createElement('div')
  document.body.appendChild(targetDiv)
  targetDiv.setAttribute('dir', 'rtl')
  SwalWithoutAnimation.fire({ target: targetDiv })
  assert.ok(Swal.getContainer().classList.contains('swal2-rtl'))
})

QUnit.test('container should have .swal2-rtl in case of <div style="direction: rtl">', (assert) => {
  const targetDiv = document.createElement('div')
  document.body.appendChild(targetDiv)
  targetDiv.style.direction = 'rtl'
  SwalWithoutAnimation.fire({ target: targetDiv })
  assert.ok(Swal.getContainer().classList.contains('swal2-rtl'))
})
