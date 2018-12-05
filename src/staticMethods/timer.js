import globalState from '../globalState'

/**
 * If `timer` parameter is set, returns number os milliseconds of timer remained.
 * Otherwise, returns undefined.
 */
export const getTimerLeft = () => {
  return globalState.timeout && globalState.timeout.getTimerLeft()
}

/**
 * Stop timer manually. Returns number os milliseconds of timer remained.
 * Otherwise, returns undefined.
 */
export const stopTimer = () => {
  return globalState.timeout && globalState.timeout.stop()
}
