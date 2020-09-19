const { Swal, SwalWithoutAnimation } = require('./helpers')

QUnit.test('default focus', (assert) => {
  const done = assert.async()

  SwalWithoutAnimation.fire('Modal with the Confirm button only')
  assert.equal(document.activeElement, document.querySelector('.swal2-confirm'))

  SwalWithoutAnimation.fire({
    text: 'Modal with two buttons',
    showCancelButton: true
  })
  assert.equal(document.activeElement, document.querySelector('.swal2-confirm'))

  SwalWithoutAnimation.fire({
    text: 'Modal with no focusable elements in it',
    showConfirmButton: false
  })
  assert.equal(document.activeElement, document.querySelector('.swal2-modal'))

  SwalWithoutAnimation.fire({
    text: 'Modal with an input',
    input: 'text',
    didOpen: () => {
      assert.equal(document.activeElement, document.querySelector('.swal2-input'))
      done()
    }
  })
})

QUnit.test('focusConfirm', (assert) => {
  Swal.fire({
    showCancelButton: true
  })
  assert.equal(document.activeElement, Swal.getConfirmButton())

  const anchor = document.createElement('a')
  anchor.innerText = 'link'
  anchor.href = ''
  Swal.fire({
    html: anchor,
    showCancelButton: true,
    focusConfirm: false
  })
  assert.equal(document.activeElement.outerHTML, anchor.outerHTML)
})

QUnit.test('focusCancel', (assert) => {
  Swal.fire({
    text: 'Modal with Cancel button focused',
    showCancelButton: true,
    focusCancel: true
  })
  assert.equal(document.activeElement, Swal.getCancelButton())
})

QUnit.test('focusDeny', (assert) => {
  Swal.fire({
    text: 'Modal with Deny button focused',
    showDenyButton: true,
    focusDeny: true
  })
  assert.equal(document.activeElement, Swal.getDenyButton())
})

// TODO(@limonte): this test needs to be revisited
// is passes even runs (2nd, 4th, 6th) and fails odd runs (1st, 3rd, 5th)
// I suspect something is wrong with the testing environment as the same
// code passes always outside it
// QUnit.test('previousActiveElement', (assert) => {
//   const done = assert.async()

//   const buttonToast = document.createElement('button')
//   buttonToast.innerText = 'Show toast'
//   document.body.appendChild(buttonToast)

//   const buttonModal = document.createElement('button')
//   buttonModal.innerText = 'Show modal'
//   document.body.appendChild(buttonModal)

//   buttonToast.addEventListener('click', () => {
//     SwalWithoutAnimation.fire({
//       text: 'I should not touch previousActiveElement',
//       toast: true,
//       timer: 1,
//       didClose: () => {
//         buttonModal.focus()
//         buttonModal.click()
//       }
//     })
//   })

//   buttonModal.addEventListener('click', () => {
//     SwalWithoutAnimation.fire({
//       text: 'I should trap focus inside myself and restore previousActiveElement when I\'m closed',
//       timer: 1,
//       didClose: () => {
//         assert.equal(document.activeElement, buttonModal)
//         done()
//       }
//     })
//   })

//   buttonToast.click()
// })
