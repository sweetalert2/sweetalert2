import { Swal, SwalWithoutAnimation, TIMEOUT } from '../../utils'

describe('getInput()', () => {
  it('Swal.getInput() should return null when a popup is disposed', (done) => {
    SwalWithoutAnimation.fire({
      input: 'text',
      didClose: () => {
        setTimeout(() => {
          expect(Swal.getInput()).to.be.null
          done()
        }, TIMEOUT)
      }
    })
    Swal.close()
  })

  it('Swal.getInput() should be available in .then()', (done) => {
    SwalWithoutAnimation.fire({
      input: 'text',
    }).then(() => {
      expect(Swal.getInput()).to.not.be.null
      done()
    })
    Swal.close()
  })
})
