/* global QUnit */
const {$, Swal, SwalWithoutAnimation} = require('./helpers')

QUnit.test('default focus', (assert) => {
  const done = assert.async()

  SwalWithoutAnimation('Modal with the Confirm button only')
  assert.equal(document.activeElement, document.querySelector('.swal2-confirm'))

  SwalWithoutAnimation({
    text: 'Modal with two buttons',
    showCancelButton: true
  })
  assert.equal(document.activeElement, document.querySelector('.swal2-confirm'))

  SwalWithoutAnimation({
    text: 'Modal with no focusable elements in it',
    showConfirmButton: false
  })
  assert.equal(document.activeElement, document.querySelector('.swal2-modal'))

  SwalWithoutAnimation({
    text: 'Modal with an input',
    input: 'text',
    onOpen: () => {
      assert.equal(document.activeElement, document.querySelector('.swal2-input'))
      done()
    }
  })
})

QUnit.test('focusConfirm', (assert) => {
  Swal({
    showCancelButton: true
  })
  assert.equal(document.activeElement, $('.swal2-confirm'))

  const anchor = document.createElement('a')
  anchor.innerText = 'link'
  anchor.href = ''
  Swal({
    html: anchor,
    showCancelButton: true,
    focusConfirm: false
  })
  assert.equal(document.activeElement.outerHTML, anchor.outerHTML)
})

QUnit.test('focusCancel', (assert) => {
  Swal({
    text: 'Modal with Cancel button focused',
    showCancelButton: true,
    focusCancel: true
  })
  assert.equal(document.activeElement, $('.swal2-cancel'))
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
//     SwalWithoutAnimation({
//       text: 'I should not touch previousActiveElement',
//       toast: true,
//       timer: 1,
//       onAfterClose: () => {
//         buttonModal.focus()
//         buttonModal.click()
//       }
//     })
//   })

//   buttonModal.addEventListener('click', () => {
//     SwalWithoutAnimation({
//       text: 'I should trap focus inside myself and restore previousActiveElement when I\'m closed',
//       timer: 1,
//       onAfterClose: () => {
//         setTimeout(() => {
//           assert.equal(document.activeElement, buttonModal)
//           done()
//         }, RESTORE_FOCUS_TIMEOUT)
//       }
//     })
//   })

//   buttonToast.click()
// })
