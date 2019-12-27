import { Swal, SwalWithoutAnimation } from '../../utils'

describe('progressSteps', () => {
  it('first .swal2-progress-step is active by default', (done) => {
    SwalWithoutAnimation.queue([{
      progressSteps: ['1', '2', '3'],
      onOpen: () => {
        expect(Swal.getProgressSteps().querySelector('.swal2-progress-step').classList.contains('swal2-active-progress-step')).to.be.true
        done()
      }
    }])
  })
})
