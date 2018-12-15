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

  dummyTargetElement.parentNode.removeChild(dummyTargetElement) // Remove target element before next test
  console.warn = warn // Suppress the warnings
})

QUnit.test('target positioning: bottom-end', (assert) => {
  const warn = console.warn // Suppress the warnings
  console.warn = () => true // Suppress the warnings

  const targetWidth = 600
  const targetHeight = 300

  const dummyTargetElement = Object.assign(document.createElement('div'), { id: 'dummy-target' })
  dummyTargetElement.setAttribute('style', `width: ${targetWidth}px; height: ${targetHeight}px`)
  document.body.appendChild(dummyTargetElement)

  Swal({ title: 'Custom target', target: '#dummy-target', position: 'bottom-end', animation: 'false' })
  const swalBottomPos = document.querySelector('.swal2-popup').getBoundingClientRect().bottom
  const swalRightPos = document.querySelector('.swal2-popup').getBoundingClientRect().right
  assert.ok(swalBottomPos === targetHeight - 2)
  assert.ok(swalRightPos === targetWidth - 2)
  Swal.close()

  dummyTargetElement.parentNode.removeChild(dummyTargetElement) // Remove target element before next test
  console.warn = warn // Suppress the warnings
})
