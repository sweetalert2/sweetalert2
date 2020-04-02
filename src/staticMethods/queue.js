import * as dom from '../utils/dom/index.js'

// private global state for the queue feature
let currentSteps = []

/*
 * Global function for chaining sweetAlert popups
 */
export const queue = function (steps) {
  const Swal = this
  currentSteps = steps

  const resetAndResolve = (resolve, value) => {
    currentSteps = []
    resolve(value)
  }

  const queueResult = []
  return new Promise((resolve) => {
    (function step (i, callback) {
      if (i < currentSteps.length) {
        document.body.setAttribute('data-swal2-queue-step', i)
        Swal.fire(currentSteps[i]).then((result) => {
          if (typeof result.value !== 'undefined') {
            queueResult.push(result.value)
            step(i + 1, callback)
          } else {
            resetAndResolve(resolve, { dismiss: result.dismiss })
          }
        })
      } else {
        resetAndResolve(resolve, { value: queueResult })
      }
    })(0)
  })
}

/*
 * Global function for getting the index of current popup in queue
 */
export const getQueueStep = () => dom.getContainer() && dom.getContainer().getAttribute('data-queue-step')

/*
 * Global function for inserting a popup to the queue
 */
export const insertQueueStep = (step, index) => {
  if (index && index < currentSteps.length) {
    return currentSteps.splice(index, 0, step)
  }
  return currentSteps.push(step)
}

/*
 * Global function for deleting a popup from the queue
 */
export const deleteQueueStep = (index) => {
  if (typeof currentSteps[index] !== 'undefined') {
    currentSteps.splice(index, 1)
  }
}
