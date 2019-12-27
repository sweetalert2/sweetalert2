import { Swal, SwalWithoutAnimation } from '../../utils'

describe('close()', () => {
  it('should add .swal2-hide to popup', (done) => {
    Swal.fire({
      title: 'Swal.close() test',
      onClose: () => {
        expect(Swal.getPopup().classList.contains('swal2-hide')).to.be.true
        done()
      }
    })
    Swal.close()
  })

  it('resolves to empty object', (done) => {
    Swal.fire().then(result => {
      expect(result).to.be.eql({})
      done()
    })
    Swal.close()
  })

  it('should trigger onClose', (done) => {
    Swal.fire({
      onClose: () => {
        expect(Swal.isVisible()).to.be.true
        done()
      }
    })
    Swal.close()
  })

  it('should trigger onAfterClose', (done) => {
    SwalWithoutAnimation.fire({
      onAfterClose: () => {
        expect(Swal.isVisible()).to.be.false
        done()
      }
    })
    Swal.close()
  })

  it('should not fail when calling Swal.fire() inside onAfterClose', (done) => {
    SwalWithoutAnimation.fire({
      onAfterClose: () => {
        expect(Swal.isVisible()).to.be.false
        SwalWithoutAnimation.fire({
          input: 'text',
          onOpen: () => {
            expect(Swal.getInput()).to.not.be.null
            done()
          }
        })
        expect(Swal.isVisible()).to.be.true
      }
    })
    Swal.close()
  })

  it('should not fail inside onAfterClose', (done) => {
    Swal.fire({
      onAfterClose: () => {
        Swal.close()
        expect(Swal.isVisible()).to.be.false
        done()
      }
    })
    Swal.close()
  })
})
