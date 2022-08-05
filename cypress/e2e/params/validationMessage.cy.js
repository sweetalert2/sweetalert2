import { isVisible } from '../../../src/utils/dom'
import { Swal, SwalWithoutAnimation, TIMEOUT } from '../../utils'

describe('validationMessage', () => {
  it('input: email + validationMessage', (done) => {
    SwalWithoutAnimation.fire({
      input: 'email',
      validationMessage: 'custom email validation message',
    })
    Swal.clickConfirm()
    setTimeout(() => {
      expect(isVisible(Swal.getValidationMessage())).to.be.true
      expect(Swal.getValidationMessage().textContent).to.equal('custom email validation message')
      done()
    }, TIMEOUT)
  })

  it('input: url + validationMessage', (done) => {
    SwalWithoutAnimation.fire({
      input: 'url',
      validationMessage: 'custom url validation message',
    })
    Swal.clickConfirm()
    setTimeout(() => {
      expect(isVisible(Swal.getValidationMessage())).to.be.true
      expect(Swal.getValidationMessage().textContent).to.equal('custom url validation message')
      done()
    }, TIMEOUT)
  })
})
