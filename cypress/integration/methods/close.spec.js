import { Swal, SwalWithoutAnimation } from '../../utils'

describe('close()', () => {
  it.skip('close() method', () => {
    Swal.fire({
      title: 'Swal.close() test'
    })
    Swal.close()
    expect(Swal.getPopup().classList.contains('swal2-hide')).to.be.true
  })

  it('close() resolves to empty object', (done) => {
    Swal.fire().then(result => {
      expect(result).to.be.eql({})
      done()
    })
    Swal.close()
  })

  it('onClose using close() method', (done) => {
    Swal.fire({
      onClose: () => {
        expect(Swal.isVisible()).to.be.true
        done()
      }
    })
    Swal.close()
  })

  it('onAfterClose using close() method', (done) => {
    SwalWithoutAnimation.fire({
      onAfterClose: () => {
        expect(Swal.isVisible()).to.be.false
        done()
      }
    })
    Swal.close()
  })

  it('Swal.fire() inside onAfterClose', (done) => {
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

  it('Swal.close() inside onAfterClose', (done) => {
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
