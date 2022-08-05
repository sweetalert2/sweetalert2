import { Swal, SwalWithoutAnimation, TIMEOUT } from '../../utils'

describe('inputValue', () => {
  it('inputValue number', () => {
    Swal.fire({ input: 'text', inputValue: 333 })
    expect(Swal.getInput().value).to.equal('333')
  })

  it('inputValue with object containing toPromise', (done) => {
    Swal.fire({
      input: 'text',
      inputValue: {
        toPromise: () => Promise.resolve('test'),
      },
      didOpen: () => {
        setTimeout(() => {
          expect(Swal.getInput().value).to.equal('test')
          done()
        }, TIMEOUT)
      },
    })
  })

  it('inputValue as a Promise', (done) => {
    const spy = cy.spy(console, 'warn')
    const inputTypes = ['text', 'email', 'number', 'tel', 'textarea']
    const value = '1.1 input value'
    const inputValue = new Promise((resolve) => {
      resolve('1.1 input value')
    })

    function showPopupWithInput() {
      const input = inputTypes.pop()
      SwalWithoutAnimation.fire({
        input,
        inputValue,
        didOpen: () => {
          setTimeout(() => {
            expect(Swal.getInput().value).to.equal(input === 'number' ? parseFloat(value).toString() : value)
            if (inputTypes.length) {
              showPopupWithInput()
            } else {
              done()
            }
          }, TIMEOUT)
        },
      })
    }
    showPopupWithInput()
    expect(spy.notCalled).to.be.true
  })

  it('should throw console error when inputValue as a Promise rejects', (done) => {
    const spy = cy.spy(console, 'error')
    SwalWithoutAnimation.fire({
      input: 'text',
      inputValue: new Promise((resolve, reject) => {
        reject(new Error('input promise rejected'))
      }),
      didOpen: () => {
        setTimeout(() => {
          expect(spy.calledWith('SweetAlert2: Error in inputValue promise: Error: input promise rejected')).to.be.true
          done()
        }, TIMEOUT)
      },
    })
  })

  it('should throw console warning about unexpected type of inputValue for input: text', () => {
    const spy = cy.spy(console, 'warn')
    Swal.fire({ input: 'text', inputValue: undefined })
    expect(
      spy.calledWith(
        'SweetAlert2: Unexpected type of inputValue! Expected "string", "number" or "Promise", got "undefined"'
      )
    ).to.be.true
  })

  it('should throw console warning about unexpected type of inputValue for input: textarea', () => {
    const spy = cy.spy(console, 'warn')
    Swal.fire({ input: 'textarea', inputValue: {} })
    expect(
      spy.calledWith(
        'SweetAlert2: Unexpected type of inputValue! Expected "string", "number" or "Promise", got "object"'
      )
    ).to.be.true
  })

  it('inputValue can be null', () => {
    const spy = cy.spy(console, 'error')
    Swal.fire({ input: 'select', inputOptions: { a: 'a' }, inputValue: null })
    expect(spy.notCalled).to.be.true
  })
})
