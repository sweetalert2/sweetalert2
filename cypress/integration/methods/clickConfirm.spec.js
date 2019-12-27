import { $, Swal, SwalWithoutAnimation } from '../../utils'

describe('clickConfirm()', () => {
  it('clickConfirm() should click the confirm button', (done) => {
    Swal.fire({
      input: 'radio',
      inputOptions: {
        one: 'one',
        two: 'two'
      }
    }).then((result) => {
      expect(result).to.eql({ value: 'two' })
      done()
    })
    $('.swal2-radio').querySelector('input[value="two"]').checked = true
    Swal.clickConfirm()
  })

  it('clickConfirm() should not fail if a popup is not visible', () => {
    SwalWithoutAnimation.fire()
    Swal.close()
    expect(Swal.isVisible()).to.be.false
    Swal.clickConfirm()
  })
})
