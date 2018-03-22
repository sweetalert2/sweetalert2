/* global QUnit */
const { Swal } = require('../helpers')

QUnit.test('basic mixin', (assert) => {
  const done = assert.async()
  const MySwal = Swal.mixin({ title: '1_title' })
  MySwal({
    onOpen: () => {
      assert.equal(MySwal.getTitle().textContent, '1_title')
      MySwal.clickConfirm()
    }
  }).then((result) => {
    assert.deepEqual(result, { value: true })
    done()
  })
})

QUnit.test('mixins and static properties/methods', (assert) => {
  const MySwal = Swal.mixin({})
  assert.deepEqual(Object.assign({}, MySwal), Object.assign({}, Swal))
})

QUnit.test('mixins and shorthand calls', (assert) => {
  const done = assert.async()
  const MySwal = Swal.mixin({
    title: 'no effect',
    html: 'no effect',
    onOpen: () => {
      assert.equal(MySwal.getTitle().textContent, '2_title')
      assert.equal(MySwal.getContent().textContent, '2_html')
      MySwal.clickConfirm()
      done()
    }
  })
  MySwal('2_title', '2_html')
})
