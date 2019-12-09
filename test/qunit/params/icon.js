const { Swal, SwalWithoutAnimation } = require('../helpers')
const { iconTypes } = require('../../../src/utils/classes')

QUnit.test('The popup should have the icon class', (assert) => {
  for (const icon in iconTypes) {
    SwalWithoutAnimation.fire({ icon })
    assert.ok(Swal.getPopup().classList.contains(iconTypes[icon]))
  }
})
