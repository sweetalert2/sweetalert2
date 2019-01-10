import { Swal } from '../helpers.js'

QUnit.test('getIcons() method', (assert) => {
  Swal.fire({ type: 'success' })
  const icons = Swal.getIcons()
  assert.equal(icons.length, 5)
  assert.equal(icons.filter(icon => icon.className.match('success'))[0].style.display, 'flex')
  assert.equal(icons.filter(icon => icon.className.match('error'))[0].style.display, 'none')
  assert.equal(icons.filter(icon => icon.className.match('question'))[0].style.display, 'none')
  assert.equal(icons.filter(icon => icon.className.match('warning'))[0].style.display, 'none')
  assert.equal(icons.filter(icon => icon.className.match('info'))[0].style.display, 'none')
})
