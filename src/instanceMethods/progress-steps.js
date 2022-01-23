import privateProps from '../privateProps.js'

export function getProgressSteps() {
  const domCache = privateProps.domCache.get(this)
  return domCache.progressSteps
}
