const { Swal, SwalWithoutAnimation } = require('../helpers')

QUnit.test('dynamic animation', (assert) => {
  const done = assert.async(2)

  SwalWithoutAnimation.close()

  let expectedVisible
  const customAnimationSwal = Swal.mixin({
    animation: () => {
      const isVisible = Swal.isVisible()
      assert.equal(isVisible, expectedVisible)
      done()
      return !isVisible
    }
  })

  expectedVisible = false
  customAnimationSwal.fire('1')

  expectedVisible = true
  customAnimationSwal.fire('2')
})
