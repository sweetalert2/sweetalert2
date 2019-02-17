import { swalClasses } from '../../classes.js'
import { warn } from '../../utils.js'
import * as dom from '../../dom/index.js'
import sweetAlert from '../../../sweetalert2.js'

export const renderProgressSteps = (params) => {
  let progressStepsContainer = dom.getProgressSteps()
  let currentProgressStep = parseInt(params.currentProgressStep === null ? sweetAlert.getQueueStep() : params.currentProgressStep, 10)
  if (params.progressSteps && params.progressSteps.length) {
    dom.show(progressStepsContainer)
    progressStepsContainer.innerHTML = ''
    if (currentProgressStep >= params.progressSteps.length) {
      warn(
        'Invalid currentProgressStep parameter, it should be less than progressSteps.length ' +
        '(currentProgressStep like JS arrays starts from 0)'
      )
    }
    params.progressSteps.forEach((step, index) => {
      let stepEl = document.createElement('li')
      dom.addClass(stepEl, swalClasses['progress-step'])
      stepEl.innerHTML = step
      if (index === currentProgressStep) {
        dom.addClass(stepEl, swalClasses['active-progress-step'])
      }
      progressStepsContainer.appendChild(stepEl)
      if (index !== params.progressSteps.length - 1) {
        let line = document.createElement('li')
        dom.addClass(line, swalClasses['progress-step-line'])
        if (params.progressStepsDistance) {
          line.style.width = params.progressStepsDistance
        }
        progressStepsContainer.appendChild(line)
      }
    })
  } else {
    dom.hide(progressStepsContainer)
  }
}
