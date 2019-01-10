const { $, Swal } = require('../helpers')

QUnit.test('HTMLElement as html', (assert) => {
  const form = document.createElement('form')
  const div = document.createElement('div')
  div.appendChild(document.createElement('label'))
  div.appendChild(document.createElement('input'))
  form.appendChild(div)

  Swal.fire({
    html: form
  })
  assert.equal($('#swal2-content').innerHTML, '<form><div><label></label><input></div></form>')
})
