const { $, Swal } = require('./helpers')
const jQuery = require('jquery')

QUnit.test('jQuery elements as params', (assert) => {
  Swal.fire({
    title: jQuery('<h1>jQuery title</h1>'),
    html: jQuery('<p>jQuery content</p>'),
    footer: jQuery('<footer>jQuery footer</footer>')
  })
  assert.equal($('.swal2-title').innerHTML, '<h1>jQuery title</h1>')
  assert.equal($('#swal2-content').innerHTML, '<p>jQuery content</p>')
  assert.equal($('.swal2-footer').innerHTML, '<footer>jQuery footer</footer>')
})
