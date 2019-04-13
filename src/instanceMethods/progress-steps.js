import * as dom from '../utils/dom/index.js'
import { renderProgressSteps } from '../utils/dom/renderers/renderProgressSteps'
import privateProps from '../privateProps.js'
import { warnAboutDepreation } from '../utils/utils.js';

export function getProgressSteps () {
  warnAboutDepreation('Swal.getProgressSteps()', `const swalInstance = Swal.fire({progressSteps: ['1', '2', '3']}); const progressSteps = swalInstance.params.progressSteps`)
  const innerParams = privateProps.innerParams.get(this)
  return innerParams.progressSteps
}

export function setProgressSteps (progressSteps) {
  warnAboutDepreation('Swal.setProgressSteps()', 'Swal.update()')
  const innerParams = privateProps.innerParams.get(this)
  const updatedParams = Object.assign({}, innerParams, { progressSteps })
  renderProgressSteps(this, updatedParams)
  privateProps.innerParams.set(this, updatedParams)
}

export function showProgressSteps () {
  const domCache = privateProps.domCache.get(this)
  dom.show(domCache.progressSteps)
}

export function hideProgressSteps () {
  const domCache = privateProps.domCache.get(this)
  dom.hide(domCache.progressSteps)
}
