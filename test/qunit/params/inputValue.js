const { Swal, SwalWithoutAnimation, TIMEOUT } = require('../helpers')
const sinon = require('sinon/pkg/sinon')

QUnit.test('inputValue number', (assert) => {
  Swal.fire({ input: 'text', inputValue: 333 })
  assert.ok(Swal.getInput().value, '333')
})

QUnit.test('inputValue with object containing toPromise', (assert) => {
  const done = assert.async()

  Swal.fire({
    input: 'text',
    inputValue: {
      toPromise: () => Promise.resolve('test')
    },
    didOpen: () => {
      setTimeout(() => {
        assert.equal(Swal.getInput().value, 'test')
        done()
      }, TIMEOUT)
    }
  })
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
      didOpen: () => {
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

QUnit.test('should throw console error when inputValue as a Promise rejects', (assert) => {
  const _consoleError = console.error
  const spy = sinon.spy(console, 'error')
  const done = assert.async()

  SwalWithoutAnimation.fire({
    input: 'text',
    inputValue: new Promise((resolve, reject) => {
      reject(new Error('input promise rejected'))
    }),
    didOpen: () => {
      setTimeout(() => {
        console.error = _consoleError
        assert.ok(spy.calledWith('SweetAlert2: Error in inputValue promise: Error: input promise rejected'))
        done()
      }, TIMEOUT)
    }
  })
})

QUnit.test('should throw console warning about unexpected type of inputValue', (assert) => {
  const _consoleWarn = console.warn
  const spy = sinon.spy(console, 'warn')
  Swal.fire({ input: 'text', inputValue: undefined })
  console.warn = _consoleWarn
  assert.ok(spy.calledWith('SweetAlert2: Unexpected type of inputValue! Expected "string", "number" or "Promise", got "undefined"'))
})
