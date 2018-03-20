// Currently, `this` is the private `context` (or `currentContext`) object

import setParameters from '../utils/setParameters'
import * as dom from '../utils/dom/index'

export function getProgressSteps () {
  return this.params.progressSteps
}

export function setProgressSteps (progressSteps) {
  this.params.progressSteps = progressSteps
  setParameters(this.params)
}

export function showProgressSteps () {
  dom.show(this.domCache.progressSteps)
}

export function hideProgressSteps () {
  dom.hide(this.domCache.progressSteps)
}
