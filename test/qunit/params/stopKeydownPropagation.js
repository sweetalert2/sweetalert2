/* global QUnit */
import { triggerEscape, SwalWithoutAnimation } from '../helpers.js'

QUnit.test('stopKeydownPropagation', (assert) => {
  const done = assert.async()

  document.body.addEventListener('keydown', (e) => {
    assert.equal(e.key, 'Escape')
    done()
  })

  SwalWithoutAnimation({
    title: 'Esc me and I will propagate keydown',
    onOpen: triggerEscape,
    stopKeydownPropagation: false
  })
})
