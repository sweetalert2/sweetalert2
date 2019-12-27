import { SwalWithoutAnimation, triggerKeydownEvent } from '../../utils'

describe('progressSteps', () => {
  it('stopKeydownPropagation', (done) => {
    document.body.addEventListener('keydown', (e) => {
      expect(e.key).to.equal('Escape')
      done()
    })

    SwalWithoutAnimation.fire({
      title: 'Esc me and I will propagate keydown',
      onOpen: () => triggerKeydownEvent(SwalWithoutAnimation.getPopup(), 'Escape'),
      stopKeydownPropagation: false
    })
  })
})
