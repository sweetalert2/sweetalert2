import { Swal } from '../helpers.js'

QUnit.test('getFocusableElements() method', (assert) => {
  Swal({
    input: 'text',
    html: `
      <button tabindex="-1"> tabindex -1 </button>
      <div tabindex="0">tabindex 0</div>
      <div tabindex="1">tabindex 1</div>
      <div tabindex="2">tabindex 2.1</div>
      <div tabindex="2">tabindex 2.2</div>
    `,
    showCancelButton: true,
    showCloseButton: true
  })
  const focusableElements = Swal.getFocusableElements()
  assert.equal(focusableElements.length, 8)
  assert.equal(focusableElements[0].textContent, 'tabindex 1')
  assert.equal(focusableElements[1].textContent, 'tabindex 2.1')
  assert.equal(focusableElements[2].textContent, 'tabindex 2.2')
  assert.equal(focusableElements[3], Swal.getCloseButton())
  assert.equal(focusableElements[4].textContent, 'tabindex 0')
  assert.equal(focusableElements[5], Swal.getInput())
  assert.equal(focusableElements[6], Swal.getConfirmButton())
  assert.equal(focusableElements[7], Swal.getCancelButton())
})
