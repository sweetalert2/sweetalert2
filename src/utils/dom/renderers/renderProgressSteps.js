import { swalClasses } from '../../classes.js'
import { warn } from '../../utils.js'
import * as dom from '../../dom/index.js'
import sweetAlert from '../../../sweetalert2.js'

const createStepElement = (step) => {
  const stepEl = document.createElement('li')
  dom.addClass(stepEl, swalClasses['progress-step'])
  stepEl.innerHTML = step
  return stepEl
}

const createLineElement = (params) => {
  let lineEl = document.createElement('li')
  dom.addClass(lineEl, swalClasses['progress-step-line'])
  if (params.progressStepsDistance) {
    lineEl.style.width = params.progressStepsDistance
  }
  return lineEl
}

export const renderProgressSteps = (params) => {
  let progressStepsContainer = dom.getProgressSteps()
  if (!params.progressSteps || params.progressSteps.length === 0) {
    return dom.hide(progressStepsContainer)
  }

  dom.show(progressStepsContainer)
  progressStepsContainer.innerHTML = ''
  const currentProgressStep = parseInt(params.currentProgressStep === null ? sweetAlert.getQueueStep() : params.currentProgressStep)
  if (currentProgressStep >= params.progressSteps.length) {
    warn(
      'Invalid currentProgressStep parameter, it should be less than progressSteps.length ' +
      '(currentProgressStep like JS arrays starts from 0)'
    )
  }

  params.progressSteps.forEach((step, index) => {
    const stepEl = createStepElement(step)
    progressStepsContainer.appendChild(stepEl)
    if (index === currentProgressStep) {
      dom.addClass(stepEl, swalClasses['active-progress-step'])
    }

    if (index !== params.progressSteps.length - 1) {
      const lineEl = createLineElement(step, index)
      progressStepsContainer.appendChild(lineEl)
    }
  })
}
