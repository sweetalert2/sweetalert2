import { Swal, SwalWithoutAnimation, TIMEOUT } from '../../utils'

describe('getQueueStep()', () => {
  it('getQueueStep() method', (done) => {
    SwalWithoutAnimation.queue(['1', '2'])
    expect('0').to.equal(Swal.getQueueStep())
    Swal.clickConfirm()
    setTimeout(() => {
      expect('1').to.equal(Swal.getQueueStep())
      SwalWithoutAnimation.fire()
      expect(null).to.equal(Swal.getQueueStep())
      done()
    }, TIMEOUT)
  })
})
