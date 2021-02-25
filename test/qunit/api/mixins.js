const { Swal } = require('../helpers')
const { SHOW_CLASS_TIMEOUT } = require('../../../src/utils/openPopup')

QUnit.test('basic mixin', (assert) => {
  const done = assert.async()
  const MySwal = Swal.mixin({ title: '1_title' })
  const swal = MySwal.fire({
    didOpen: () => {
      assert.equal(MySwal.getTitle().textContent, '1_title')
      MySwal.clickConfirm()
    }
  })
  assert.ok(swal instanceof MySwal)
  assert.ok(swal instanceof Swal)
  swal.then((result) => {
    assert.deepEqual(result, {
      value: true,
      isConfirmed: true,
      isDenied: false,
      isDismissed: false,
    })
    done()
  })
})

QUnit.test('mixins and shorthand calls', (assert) => {
  const done = assert.async()
  const MySwal = Swal.mixin({
    title: 'no effect',
    html: 'no effect',
    didOpen: () => {
      assert.equal(MySwal.getTitle().textContent, '2_title')
      assert.equal(MySwal.getContent().textContent, '2_html')
      MySwal.clickConfirm()
      done()
    }
  })
  MySwal.fire('2_title', '2_html')
})

QUnit.test('mixins precedence', (assert) => {
  Swal.mixin({ title: '1' }).mixin({ title: '2' }).fire()
  assert.equal(Swal.getTitle().textContent, '2')
})

QUnit.test('params from 2nd mixin should override params from 1st mixin', (assert) => {
  const done = assert.async()
  Swal
    .mixin({ showClass: { popup: 'i-should-be-overriden' } })
    .mixin({ showClass: { backdrop: 'backdrop-custom-show-class' } })
    .fire({
      didOpen: () => {
        setTimeout(() => {
          assert.ok(Swal.getContainer().classList.contains('backdrop-custom-show-class'))
          assert.notOk(Swal.getPopup().classList.contains('i-should-be-overriden'))
          done()
        }, SHOW_CLASS_TIMEOUT)
      }
    })
})

QUnit.test('params from fire() should override params from mixin()', (assert) => {
  const done = assert.async()
  Swal
    .mixin({ showClass: { popup: 'i-should-be-overriden' } })
    .fire({
      showClass: { backdrop: 'backdrop-custom-show-class' },
      didOpen: () => {
        setTimeout(() => {
          assert.ok(Swal.getContainer().classList.contains('backdrop-custom-show-class'))
          assert.notOk(Swal.getPopup().classList.contains('i-should-be-overriden'))
          done()
        }, SHOW_CLASS_TIMEOUT)
      }
    })
})
