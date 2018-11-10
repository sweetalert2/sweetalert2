const { Swal, isVisible, TIMEOUT } = require('./helpers')
const { detect } = require('detect-browser')

const browser = detect()

if (browser.name === 'chrome' && browser.version === '30.0.0') {
  // skip test
  // .checkValidity on Android 4.4 (Chrome Mobile 30) always returns true
  // https://www.quirksmode.org/dom/forms/mobile.html#t30
} else {
  QUnit.test('input.checkValidity()', (assert) => {
    const done = assert.async()

    Swal({
      input: 'tel',
      inputAttributes: {
        pattern: '[0-9]{3}-[0-9]{3}-[0-9]{4}'
      },
      validationMessage: 'Invalid phone number'
    }).then(result => {
      assert.equal(result.value, '123-456-7890')
      done()
    })

    Swal.getInput().value = 'blah-blah'
    Swal.clickConfirm()
    setTimeout(() => {
      assert.ok(isVisible(Swal.getValidationMessage()))
      assert.equal(Swal.getValidationMessage().textContent, 'Invalid phone number')

      Swal.getInput().value = '123-456-7890'
      Swal.clickConfirm()
    }, TIMEOUT)
  })
}
