const { Swal } = require('../helpers')

QUnit.test('target', (assert) => {
  const warn = console.warn // Suppress the warnings
  console.warn = () => true // Suppress the warnings
  Swal('Default target')
  assert.equal(document.body, document.querySelector('.swal2-container').parentNode)
  Swal.close()

  const dummyTargetElement = Object.assign(document.createElement('div'), { id: 'dummy-target' })
  document.body.appendChild(dummyTargetElement)

  Swal({ title: 'Custom valid target (string)', target: '#dummy-target' }) // switch targets
  assert.equal(document.querySelector('.swal2-positioned-wrapper').parentNode, dummyTargetElement)
  assert.equal(document.querySelector('.swal2-container').parentNode, document.querySelector('.swal2-positioned-wrapper'))
  Swal.close()

  Swal({ title: 'Custom invalid target (string)', target: 'lorem_ipsum' }) // switch targets
  assert.equal(document.querySelector('.swal2-container').parentNode, document.body)
  Swal.close()

  Swal({ title: 'Custom valid target (element)', target: dummyTargetElement })
  assert.equal(document.querySelector('.swal2-positioned-wrapper').parentNode, dummyTargetElement)
  assert.equal(document.querySelector('.swal2-container').parentNode, document.querySelector('.swal2-positioned-wrapper'))
  Swal.close()

  Swal({ title: 'Custom invalid target (element)', target: true })
  assert.equal(document.body, document.querySelector('.swal2-container').parentNode)
  Swal.close()
  console.warn = warn // Suppress the warnings
})


