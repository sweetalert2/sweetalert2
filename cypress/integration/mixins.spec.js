import { Swal } from '../utils'
import { SHOW_CLASS_TIMEOUT } from '../../src/utils/openPopup'

describe('mixins', () => {
  it('basic mixin', (done) => {
    const MySwal = Swal.mixin({ title: '1_title' })
    const swal = MySwal.fire({
      didOpen: () => {
        expect(MySwal.getTitle().textContent).to.equal('1_title')
        MySwal.clickConfirm()
      },
    })
    expect(swal instanceof MySwal).to.be.true
    expect(swal instanceof Swal).to.be.true
    swal.then((result) => {
      expect(result).to.eql({
        value: true,
        isConfirmed: true,
        isDenied: false,
        isDismissed: false,
      })
      done()
    })
  })

  it('mixins and shorthand calls', (done) => {
    const MySwal = Swal.mixin({
      title: 'no effect',
      html: 'no effect',
      didOpen: () => {
        expect(MySwal.getTitle().textContent).to.equal('2_title')
        expect(MySwal.getHtmlContainer().textContent).to.equal('2_html')
        MySwal.clickConfirm()
        done()
      },
    })
    MySwal.fire('2_title', '2_html')
  })

  it('mixins precedence', () => {
    Swal.mixin({ title: '1' }).mixin({ title: '2' }).fire()
    expect(Swal.getTitle().textContent).to.equal('2')
  })

  it('params from 2nd mixin should override params from 1st mixin', (done) => {
    Swal.mixin({ showClass: { popup: 'i-should-be-overriden' } })
      .mixin({ showClass: { backdrop: 'backdrop-custom-show-class' } })
      .fire({
        didOpen: () => {
          setTimeout(() => {
            expect(Swal.getContainer().classList.contains('backdrop-custom-show-class')).to.be.true
            expect(Swal.getPopup().classList.contains('i-should-be-overriden')).to.be.false
            done()
          }, SHOW_CLASS_TIMEOUT)
        },
      })
  })

  it('params from fire() should override params from mixin()', (done) => {
    Swal.mixin({ showClass: { popup: 'i-should-be-overriden' } }).fire({
      showClass: { backdrop: 'backdrop-custom-show-class' },
      didOpen: () => {
        setTimeout(() => {
          expect(Swal.getContainer().classList.contains('backdrop-custom-show-class')).to.be.true
          expect(Swal.getPopup().classList.contains('i-should-be-overriden')).to.be.false
          done()
        }, SHOW_CLASS_TIMEOUT)
      },
    })
  })
})
