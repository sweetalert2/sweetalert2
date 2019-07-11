const { Swal, SwalWithoutAnimation } = require('../helpers')

class PositionChecker {
  constructor (container, offset) {
    this._offset = offset
    this._containerTop = (container === window ? 0 : container.offsetTop)
    this._containerCenter = (container === window) ? window.innerHeight / 2 : container.offsetTop + container.clientHeight / 2
    this._containerBottom = (container === window) ? window.innerHeight : container.offsetTop + container.clientHeight
    this._containerLeft = (container === window ? 0 : container.offsetLeft)
    this._containerMiddle = (container === window) ? window.innerWidth / 2 : container.offsetLeft + container.clientWidth / 2
    this._containerRight = (container === window) ? window.innerWidth : container.offsetLeft + container.clientWidth

    this._checkFunctions = {
      top: this.isTop.bind(this),
      center: this.isCenter.bind(this),
      bottom: this.isBottom.bind(this),
      left: this.isLeft.bind(this),
      middle: this.isMiddle.bind(this),
      right: this.isRight.bind(this)
    }
  }

  isTop (clientRect) {
    return (Math.abs(clientRect.top - (this._containerTop + this._offset)) < 1)
  }

  isCenter (clientRect) {
    const rectCenter = clientRect.top + (clientRect.height / 2)
    return (Math.abs(rectCenter - this._containerCenter) < 1)
  }

  isBottom (clientRect) {
    return (Math.abs(clientRect.bottom - (this._containerBottom - this._offset)) < 1)
  }

  isLeft (clientRect) {
    return (Math.abs(clientRect.left - (this._containerLeft + this._offset)) < 1)
  }

  isMiddle (clientRect) {
    const clientMiddle = clientRect.left + (clientRect.width / 2)
    return (Math.abs(clientMiddle - this._containerMiddle) < 1)
  }

  isRight (clientRect) {
    return (Math.abs(clientRect.right - (this._containerRight - this._offset)) < 1)
  }

  check (pos, clientRect) {
    const verPos = pos.split('-')[0]
    const horPos = pos.split('-')[1] || 'middle'
    return this._checkFunctions[verPos](clientRect) && this._checkFunctions[horPos](clientRect)
  }
}

const allowedPostions = [
  'top-left', 'top', 'top-right',
  'center-left', 'center', 'center-right',
  'bottom-left', 'bottom', 'bottom-right'
]

QUnit.test('Modal positions', (assert) => {
  const warn = console.warn // Suppress the warnings
  console.warn = () => true // Suppress the warnings

  const checkPosition = new PositionChecker(window, 10)

  allowedPostions.forEach(position => {
    SwalWithoutAnimation.fire({ position: position })
    const swalRect = document.querySelector('.swal2-popup').getBoundingClientRect()
    assert.ok(checkPosition.check(position, swalRect), `Failed modal position on "${navigator.userAgent}": ${position} \n Swal: (${swalRect.top}, ${swalRect.right}, ${swalRect.bottom}, ${swalRect.left})x(${swalRect.height}, ${swalRect.width})\n Window: (${window.innerHeight} ${window.innerWidth})`)
    Swal.close()
  })

  console.warn = warn // Re-enable warnings
})

QUnit.test('Toast positions', (assert) => {
  const warn = console.warn // Suppress the warnings
  console.warn = () => true // Suppress the warnings

  const checkPosition = new PositionChecker(window, 0)

  allowedPostions.forEach(position => {
    SwalWithoutAnimation.fire({ toast: 'true', position: position })
    const swalRect = document.querySelector('.swal2-container').getBoundingClientRect()
    assert.ok(checkPosition.check(position, swalRect), `Failed toast position: on "${navigator.userAgent}": ${position} \n Swal: (${swalRect.top}, ${swalRect.right}, ${swalRect.bottom}, ${swalRect.left})x(${swalRect.height}, ${swalRect.width})\n Window: (${window.innerHeight} ${window.innerWidth})`)
    Swal.close()
  })

  console.warn = warn // Re-enable warnings
})

QUnit.test('Modal positions with target', (assert) => {
  const warn = console.warn // Suppress the warnings
  console.warn = () => true // Suppress the warnings

  const targetWidth = 600
  const targetHeight = 300

  // Add custom style
  const style = document.createElement('style')
  style.innerHTML += '.position-absolute { position: absolute; }'
  document.body.appendChild(style)

  // Create target container
  const dummyTargetElement = Object.assign(document.createElement('div'), { id: 'dummy-target' })
  dummyTargetElement.setAttribute('style', `width: ${targetWidth}px; height: ${targetHeight}px; position: relative;`)
  document.body.appendChild(dummyTargetElement)

  const checkPosition = new PositionChecker(dummyTargetElement, 10)

  allowedPostions.forEach(position => {
    SwalWithoutAnimation.fire({ target: '#dummy-target', customClass: { container: 'position-absolute' }, position: position })
    const swalRect = document.querySelector('.swal2-popup').getBoundingClientRect()
    assert.ok(checkPosition.check(position, swalRect), `Failed modal position with target on "${navigator.userAgent}": ${position} \n Swal: (${swalRect.top}, ${swalRect.right}, ${swalRect.bottom}, ${swalRect.left})x(${swalRect.height}, ${swalRect.width})`)
    Swal.close()
  })

  dummyTargetElement.parentNode.removeChild(dummyTargetElement) // Remove target element before next test
  console.warn = warn // Re-enable warnings
})

QUnit.test('Toast positions with target', (assert) => {
  const warn = console.warn // Suppress the warnings
  console.warn = () => true // Suppress the warnings

  const targetWidth = 600
  const targetHeight = 300

  const style = document.createElement('style')
  style.innerHTML += '.position-absolute { position: absolute; }'
  document.body.appendChild(style)

  const dummyTargetElement = Object.assign(document.createElement('div'), { id: 'dummy-target' })
  dummyTargetElement.setAttribute('style', `width: ${targetWidth}px; height: ${targetHeight}px; position: relative;`)
  document.body.appendChild(dummyTargetElement)

  const checkPosition = new PositionChecker(dummyTargetElement, 0)

  allowedPostions.forEach(position => {
    SwalWithoutAnimation.fire({ target: '#dummy-target', customClass: { container: 'position-absolute' }, toast: 'true', position: position })
    const swalRect = document.querySelector('.swal2-container').getBoundingClientRect()
    assert.ok(checkPosition.check(position, swalRect), `Failed toast position with target on "${navigator.userAgent}": ${position}\n Swal: (${swalRect.top}, ${swalRect.right}, ${swalRect.bottom}, ${swalRect.left})x(${swalRect.height}, ${swalRect.width})`)
    Swal.close()
  })

  dummyTargetElement.parentNode.removeChild(dummyTargetElement) // Remove target element before next test
  console.warn = warn // Re-enable warnings
})
