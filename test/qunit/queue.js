const { $, Swal, SwalWithoutAnimation, TIMEOUT } = require('./helpers')

QUnit.test('queue', (assert) => {
  const done = assert.async()
  const steps = ['Step 1', 'Step 2']

  assert.equal(Swal.getQueueStep(), null)

  SwalWithoutAnimation.queue(steps).then(() => {
    SwalWithoutAnimation.fire('All done!')
  })

  assert.equal($('.swal2-modal h2').textContent, 'Step 1')
  assert.equal(Swal.getQueueStep(), 0)
  SwalWithoutAnimation.clickConfirm()

  setTimeout(() => {
    assert.equal($('.swal2-modal h2').textContent, 'Step 2')
    assert.equal(Swal.getQueueStep(), 1)
    SwalWithoutAnimation.clickConfirm()

    setTimeout(() => {
      assert.equal($('.swal2-modal h2').textContent, 'All done!')
      assert.equal(SwalWithoutAnimation.getQueueStep(), null)
      SwalWithoutAnimation.clickConfirm()

      // test queue is cancelled on first step, other steps shouldn't be shown
      SwalWithoutAnimation.queue(steps)
      SwalWithoutAnimation.clickCancel()
      assert.notOk(SwalWithoutAnimation.isVisible())
      done()
    }, TIMEOUT)
  }, TIMEOUT)
})

QUnit.test('dymanic queue', (assert) => {
  const done = assert.async()
  const steps = [
    {
      title: 'Step 1',
      preConfirm: () => {
        return new Promise((resolve) => {
          // insert to the end by default
          Swal.insertQueueStep('Step 3')
          // step to be deleted
          Swal.insertQueueStep('Step to be deleted')
          // insert with positioning
          Swal.insertQueueStep({
            title: 'Step 2',
            preConfirm: () => {
              return new Promise((resolve) => {
                Swal.deleteQueueStep(3)
                resolve()
              })
            }
          }, 1)
          resolve()
        })
      }
    }
  ]

  setTimeout(() => {
    SwalWithoutAnimation.queue(steps).then(() => {
      Swal.fire('All done!')
    })

    assert.equal($('.swal2-modal h2').textContent, 'Step 1')
    Swal.clickConfirm()

    setTimeout(() => {
      assert.equal($('.swal2-modal h2').textContent, 'Step 2')
      assert.equal(Swal.getQueueStep(), 1)
      Swal.clickConfirm()

      setTimeout(() => {
        assert.equal($('.swal2-modal h2').textContent, 'Step 3')
        assert.equal(Swal.getQueueStep(), 2)
        Swal.clickConfirm()

        setTimeout(() => {
          assert.equal($('.swal2-modal h2').textContent, 'All done!')
          assert.equal(Swal.getQueueStep(), null)
          Swal.clickConfirm()
          done()
        }, TIMEOUT)
      }, TIMEOUT)
    }, TIMEOUT)
  }, TIMEOUT)
})
