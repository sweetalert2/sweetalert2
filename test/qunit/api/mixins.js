/* global QUnit */
const { swal } = require('../helpers')

QUnit.test('basic mixin', (assert) => {
  const done = assert.async()
  const mySwal = swal.mixin({
    input: 'text',
    inputValue: 'inputValue'
  })
  assert.deepEqual(Object.assign({}, mySwal), Object.assign({}, swal))
  mySwal({ onOpen: () => mySwal.clickConfirm() })
    .then((result) => {
      assert.equal(result.value, 'inputValue')
      done()
    })
})

QUnit.test('mixins and shorthand calls', (assert) => {
  const done = assert.async()
  const mySwal = swal
    .plugin(swal => params => {
      assert.deepEqual(params, { title: 'title', html: 'html', type: 'info', footer: 'footer' })
      done()
    })
    .mixin({ title: 'no effect', html: 'no effect', type: 'error', footer: 'footer' })
  mySwal('title', 'html', 'info')
})
