import { Swal, SwalWithoutAnimation } from '../../utils'

describe('close()', () => {
  it('should add .swal2-hide to popup', (done) => {
    Swal.fire({
      title: 'Swal.close() test',
      willClose: () => {
        expect(Swal.getPopup().classList.contains('swal2-hide')).to.be.true
        done()
      }
    })
    Swal.close()
  })

  it('resolves when calling Swal.close()', (done) => {
    Swal.fire().then(result => {
      expect(result).to.be.eql({
        isConfirmed: false,
        isDenied: false,
        isDismissed: true,
      })
      done()
    })
    Swal.close()
  })

  it('should trigger willClose', (done) => {
    Swal.fire({
      willClose: () => {
        expect(Swal.isVisible()).to.be.true
        done()
      }
    })
    Swal.close()
  })

  it('should trigger didClose', (done) => {
    SwalWithoutAnimation.fire({
      didClose: () => {
        expect(Swal.isVisible()).to.be.false
        done()
      }
    })
    Swal.close()
  })

  it('should not fail when calling Swal.fire() inside didClose', (done) => {
    SwalWithoutAnimation.fire({
      didClose: () => {
        expect(Swal.isVisible()).to.be.false
        SwalWithoutAnimation.fire({
          input: 'text',
          didOpen: () => {
            expect(Swal.getInput()).to.not.be.null
            done()
          }
        })
        expect(Swal.isVisible()).to.be.true
      }
    })
    Swal.close()
  })

  it('should not fail inside didClose', (done) => {
    Swal.fire({
      didClose: () => {
        Swal.close()
        expect(Swal.isVisible()).to.be.false
        done()
      }
    })
    Swal.close()
  })
})
