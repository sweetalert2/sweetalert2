const { Swal, SwalWithoutAnimation, TIMEOUT } = require('../helpers')
const sinon = require('sinon/pkg/sinon')

QUnit.test('inputValue number', (assert) => {
  Swal.fire({ input: 'text', inputValue: 333 })
  assert.ok(Swal.getInput().value, '333')
})

QUnit.test('inputValue as a Promise', (assert) => {
  const _consoleWarn = console.warn
  const spy = sinon.spy(console, 'warn')
  const done = assert.async()

  const inputTypes = ['text', 'email', 'number', 'tel', 'textarea']
  const value = '1.1 input value'
  const inputValue = new Promise((resolve) => {
    resolve('1.1 input value')
  })

  function showPopupWithInput () {
    const input = inputTypes.pop()
    SwalWithoutAnimation.fire({
      input,
      inputValue,
      onOpen: () => {
        setTimeout(() => {
          assert.equal(Swal.getInput().value, input === 'number' ? parseFloat(value) : value)
          if (inputTypes.length) {
            showPopupWithInput()
          } else {
            done()
          }
        }, TIMEOUT)
      }
    })
  }
  showPopupWithInput()

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
