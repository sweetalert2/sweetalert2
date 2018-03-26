/* global QUnit */
const { Swal } = require('../helpers')

QUnit.test('basic mixin', (assert) => {
  const done = assert.async()
  const MySwal = Swal.mixin({ title: '1_title' })
  const swal = MySwal({
    onOpen: () => {
      assert.equal(MySwal.getTitle().textContent, '1_title')
      MySwal.clickConfirm()
    }
  })
  assert.ok(swal instanceof MySwal)
  assert.ok(swal instanceof Swal)
  swal.then((result) => {
    assert.deepEqual(result, { value: true })
    done()
  })
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
