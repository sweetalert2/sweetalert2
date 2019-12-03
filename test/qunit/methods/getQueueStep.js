import { Swal, SwalWithoutAnimation, TIMEOUT } from '../helpers.js'

QUnit.test('getQueueStep() method', (assert) => {
  const done = assert.async()

  SwalWithoutAnimation.queue(['1', '2'])
  assert.equal('0', Swal.getQueueStep())

  Swal.clickConfirm()
  setTimeout(() => {
    assert.equal('1', Swal.getQueueStep())
    SwalWithoutAnimation.fire()
    assert.equal(null, Swal.getQueueStep())
    done()
  }, TIMEOUT)
})
