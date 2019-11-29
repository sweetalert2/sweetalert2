const { Swal } = require('./helpers')
const jQuery = require('jquery')

QUnit.test('jQuery elements as shorthand params', (assert) => {
  Swal.fire(
    jQuery('<h1>jQuery title</h1>'),
    jQuery('<p>jQuery content</p>')
  )
  assert.equal(Swal.getTitle().innerHTML, '<h1>jQuery title</h1>')
  assert.equal(Swal.getHtmlContainer().innerHTML, '<p>jQuery content</p>')
})

QUnit.test('jQuery elements as params', (assert) => {
  Swal.fire({
    title: jQuery('<h1>jQuery title</h1>'),
    html: jQuery('<p>jQuery content</p>'),
    footer: jQuery('<footer>jQuery footer</footer>')
  })
  assert.equal(Swal.getTitle().innerHTML, '<h1>jQuery title</h1>')
  assert.equal(Swal.getHtmlContainer().innerHTML, '<p>jQuery content</p>')
  assert.equal(Swal.getFooter().innerHTML, '<footer>jQuery footer</footer>')
})
