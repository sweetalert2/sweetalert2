import globalState from '../globalState'

/**
 * If `timer` parameter is set, returns number os milliseconds of timer remained.
 * Otherwise, returns null.
 */
export const getTimerLeft = () => {
  return globalState.timeout && globalState.timeout.getTimerLeft()
}
