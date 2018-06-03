import globalState from '../globalState'

/**
 * Show spinner instead of Confirm button and disable Cancel button
 */
export const getTimerLeft = () => {
  return globalState.timeout && globalState.timeout.getTimerLeft()
}
