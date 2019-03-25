const { Swal } = require('../helpers')

QUnit.test('target', (assert) => {
  const warn = console.warn // Suppress the warnings
  console.warn = () => true // Suppress the warnings
  Swal.fire('Default target')
  assert.equal(document.body, Swal.getContainer().parentNode)
  Swal.close()

  const dummyTargetElement = Object.assign(document.createElement('div'), { id: 'dummy-target' })
  document.body.appendChild(dummyTargetElement)

  Swal.fire({ title: 'Custom valid target (string)', target: '#dummy-target' }) // switch targets
  assert.equal(Swal.getContainer().parentNode, dummyTargetElement)
  Swal.close()

  Swal.fire({ title: 'Custom invalid target (string)', target: 'lorem_ipsum' }) // switch targets
  assert.equal(Swal.getContainer().parentNode, document.body)
  Swal.close()

  Swal.fire({ title: 'Custom valid target (element)', target: dummyTargetElement })
  assert.equal(Swal.getContainer().parentNode, dummyTargetElement)
  Swal.close()

  Swal.fire({ title: 'Custom invalid target (element)', target: true })
  assert.equal(document.body, Swal.getContainer().parentNode)
  Swal.close()
  console.warn = warn // Re-enable warnings
})
