/* global QUnit */
const {Swal, triggerKeydownEvent} = require('./helpers')

QUnit.test('focus trap forward', (assert) => {
  const done = assert.async()
  Swal({
    input: 'text',
    showCancelButton: true,
    showCloseButton: true,
    onOpen: () => {
      assert.equal(document.activeElement, Swal.getInput())
      triggerKeydownEvent(document.activeElement, 'Tab')
      assert.equal(document.activeElement, Swal.getConfirmButton())
      triggerKeydownEvent(document.activeElement, 'Tab')
      assert.equal(document.activeElement, Swal.getCancelButton())
      triggerKeydownEvent(document.activeElement, 'Tab')
      assert.equal(document.activeElement, Swal.getCloseButton())
      triggerKeydownEvent(document.activeElement, 'Tab')
      assert.equal(document.activeElement, Swal.getInput())
      done()
    }
  })
})

QUnit.test('focus trap backward', (assert) => {
  const done = assert.async()
  Swal({
    input: 'text',
    showCancelButton: true,
    showCloseButton: true,
    onOpen: () => {
      assert.equal(document.activeElement, Swal.getInput())
      triggerKeydownEvent(document.activeElement, 'Tab', {shiftKey: true})
      assert.equal(document.activeElement, Swal.getCloseButton())
      triggerKeydownEvent(document.activeElement, 'Tab', {shiftKey: true})
      assert.equal(document.activeElement, Swal.getCancelButton())
      triggerKeydownEvent(document.activeElement, 'Tab', {shiftKey: true})
      assert.equal(document.activeElement, Swal.getConfirmButton())
      triggerKeydownEvent(document.activeElement, 'Tab', {shiftKey: true})
      assert.equal(document.activeElement, Swal.getInput())
      done()
    }
  })
})
