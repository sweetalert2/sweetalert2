import { Swal, SwalWithoutAnimation, TIMEOUT } from '../../utils'

describe('getInput()', () => {
  it('Swal.getInput() should return null when a popup is disposed', (done) => {
    SwalWithoutAnimation.fire({
      input: 'text',
      onAfterClose: () => {
        setTimeout(() => {
          assert.notOk(Swal.getInput())
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
