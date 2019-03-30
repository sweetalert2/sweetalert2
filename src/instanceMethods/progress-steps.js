import * as dom from '../utils/dom/index.js'
import { renderProgressSteps } from '../utils/dom/renderers/renderProgressSteps'
import privateProps from '../privateProps.js'

export function getProgressSteps () {
  const innerParams = privateProps.innerParams.get(this)
  return innerParams.progressSteps
}

export function setProgressSteps (progressSteps) {
  const innerParams = privateProps.innerParams.get(this)
  const updatedParams = Object.assign({}, innerParams, { progressSteps })
  privateProps.innerParams.set(this, updatedParams)
  renderProgressSteps(updatedParams)
}

const getDomCacheProgressSteps = (instance) => privateProps.domCache.get(instance).progressSteps

export const showProgressSteps = () => dom.hide(getDomCacheProgressSteps(this))

export const hideProgressSteps = () => dom.hide(getDomCacheProgressSteps(this))
