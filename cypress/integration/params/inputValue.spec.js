import { Swal, SwalWithoutAnimation, TIMEOUT } from '../../utils'

describe('inputValue', () => {
  it('inputValue number', () => {
    Swal.fire({ input: 'text', inputValue: 333 })
    expect(Swal.getInput().value).to.equal('333')
  })

  it('inputValue as a Promise', (done) => {
    const spy = cy.spy(console, 'warn')
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
            expect(Swal.getInput().value).to.equal(input === 'number' ? parseFloat(value).toString() : value)
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
    expect(spy.notCalled).to.be.true
  })

  it('should throw console error when inputValue as a Promise rejects', (done) => {
    const spy = cy.spy(console, 'error')
    SwalWithoutAnimation.fire({
      input: 'text',
      inputValue: new Promise((resolve, reject) => {
        reject(new Error('input promise rejected'))
      }),
      onOpen: () => {
        setTimeout(() => {
          expect(spy.calledWith('SweetAlert2: Error in inputValue promise: Error: input promise rejected')).to.be.true
          done()
        }, TIMEOUT)
      }
    })
  })

  it('should throw console warning about unexpected type of inputValue', () => {
    const spy = cy.spy(console, 'warn')
    Swal.fire({ input: 'text', inputValue: undefined })
    expect(spy.calledWith('SweetAlert2: Unexpected type of inputValue! Expected "string", "number" or "Promise", got "undefined"')).to.be.true
  })
})
