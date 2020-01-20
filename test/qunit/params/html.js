const { Swal } = require('../helpers')

QUnit.test('HTMLElement as html', (assert) => {
  const form = document.createElement('form')
  const div = document.createElement('div')
  div.appendChild(document.createElement('label'))
  div.appendChild(document.createElement('input'))
  form.appendChild(div)

  Swal.fire({
    html: form
  })
  assert.equal(Swal.getHtmlContainer().innerHTML, '<form><div><label></label><input></div></form>')
})

QUnit.test('Error as html', (assert) => {
  const error = new Error()
  error.message = 'something is broken'

  Swal.fire({
    html: error
  })
  assert.equal(Swal.getHtmlContainer().innerHTML, 'Error: something is broken')
})
