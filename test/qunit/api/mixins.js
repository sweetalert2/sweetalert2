/* global QUnit */
const { swal } = require('../helpers')

QUnit.test('basic mixin', (assert) => {
  const done = assert.async()
  const mySwal = swal.mixin({ title: '1_title' })
  mySwal({
    onOpen: () => {
      assert.equal(mySwal.getTitle().textContent, '1_title')
      mySwal.clickConfirm()
    }
  }).then((result) => {
    assert.deepEqual(result, { value: true })
    done()
  })
})

QUnit.test('mixins and static properties/methods', (assert) => {
  const mySwal = swal.mixin({})
  assert.deepEqual(Object.assign({}, mySwal), Object.assign({}, swal))
})

QUnit.test('mixins and shorthand calls', (assert) => {
  const done = assert.async()
  const mySwal = swal.mixin({
    title: 'no effect',
    html: 'no effect',
    onOpen: () => {
      assert.equal(mySwal.getTitle().textContent, '2_title')
      assert.equal(mySwal.getContent().textContent, '2_html')
      mySwal.clickConfirm()
      done()
    }
  })
  mySwal('2_title', '2_html')
})
