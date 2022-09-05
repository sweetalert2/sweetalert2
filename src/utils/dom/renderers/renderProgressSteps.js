import { swalClasses } from '../../classes.js'
import * as dom from '../../dom/index.js'
import { warn } from '../../utils.js'

/**
 * @param {SweetAlert2} instance
 * @param {SweetAlertOptions} params
 */
export const renderProgressSteps = (instance, params) => {
  const progressStepsContainer = dom.getProgressSteps()
  if (!params.progressSteps || params.progressSteps.length === 0) {
    return dom.hide(progressStepsContainer)
  }

  dom.show(progressStepsContainer)
  progressStepsContainer.textContent = ''
  if (params.currentProgressStep >= params.progressSteps.length) {
    warn(
      'Invalid currentProgressStep parameter, it should be less than progressSteps.length ' +
        '(currentProgressStep like JS arrays starts from 0)'
    )
  }

  params.progressSteps.forEach((step, index) => {
    const stepEl = createStepElement(step)
    progressStepsContainer.appendChild(stepEl)
    if (index === params.currentProgressStep) {
      dom.addClass(stepEl, swalClasses['active-progress-step'])
    }

    if (index !== params.progressSteps.length - 1) {
      const lineEl = createLineElement(params)
      progressStepsContainer.appendChild(lineEl)
    }
  })
}

/**
 * @param {string} step
 * @returns {HTMLLIElement}
 */
const createStepElement = (step) => {
  const stepEl = document.createElement('li')
  dom.addClass(stepEl, swalClasses['progress-step'])
  dom.setInnerHtml(stepEl, step)
  return stepEl
}

/**
 * @param {SweetAlertOptions} params
 * @returns {HTMLLIElement}
 */
const createLineElement = (params) => {
  const lineEl = document.createElement('li')
  dom.addClass(lineEl, swalClasses['progress-step-line'])
  if (params.progressStepsDistance) {
    dom.applyNumericalStyle(lineEl, 'width', params.progressStepsDistance)
  }
  return lineEl
}
