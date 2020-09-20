import { triggerKeydownEvent, SwalWithoutAnimation } from '../helpers.js'

QUnit.test('stopKeydownPropagation', (assert) => {
  const done = assert.async()

  document.body.addEventListener('keydown', (e) => {
    assert.equal(e.key, 'Escape')
    done()
  })

  SwalWithoutAnimation.fire({
    title: 'Esc me and I will propagate keydown',
    didOpen: () => triggerKeydownEvent(SwalWithoutAnimation.getPopup(), 'Escape'),
    stopKeydownPropagation: false
  })
})
