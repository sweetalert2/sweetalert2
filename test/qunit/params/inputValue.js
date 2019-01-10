const { Swal, SwalWithoutAnimation, TIMEOUT } = require('../helpers')
const sinon = require('sinon/pkg/sinon')

QUnit.test('inputValue number', (assert) => {
  Swal.fire({ input: 'text', inputValue: 333 })
  assert.ok(Swal.getInput().value, '333')
})

QUnit.test('inputValue as a Promise', (assert) => {
  const _consoleWarn = console.warn
  const spy = sinon.spy(console, 'warn')

  const inputTypes = ['text', 'email', 'number', 'tel', 'textarea']
  const done = assert.async(inputTypes.length)
  const value = '1.1 input value'
  const inputValue = new Promise((resolve) => {
    resolve('1.1 input value')
  })
  inputTypes.forEach(input => {
    SwalWithoutAnimation.fire({
      input,
      inputValue,
      onOpen: (modal) => {
        setTimeout(() => {
          const inputEl = input === 'textarea' ? modal.querySelector('.swal2-textarea') : modal.querySelector('.swal2-input')
          assert.equal(inputEl.value, input === 'number' ? parseFloat(value) : value)
          done()
        }, TIMEOUT)
      }
    })
  })

  console.warn = _consoleWarn
  assert.ok(spy.notCalled)
})

QUnit.test('should throw console warning about unexpected type of inputValue', (assert) => {
  const _consoleWarn = console.warn
  const spy = sinon.spy(console, 'warn')
  Swal.fire({ input: 'text', inputValue: undefined })
  console.warn = _consoleWarn
  assert.ok(spy.calledWith('SweetAlert2: Unexpected type of inputValue! Expected "string", "number" or "Promise", got "undefined"'))
})
