/// <reference types="cypress" />

import { Swal, SwalWithoutAnimation } from '../../utils'

describe('progressSteps', () => {
  it('current .swal2-progress-step', (done) => {
    SwalWithoutAnimation.fire({
      progressSteps: ['1', '2', '3'],
      currentProgressStep: 0,
      didOpen: () => {
        expect(
          Swal.getProgressSteps().querySelector('.swal2-progress-step').classList.contains('swal2-active-progress-step')
        ).to.be.true
        done()
      },
    })
  })
})
