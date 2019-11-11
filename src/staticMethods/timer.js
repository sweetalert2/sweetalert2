import { animateTimerProgressBar, stopTimerProgressBar } from '../utils/dom/domUtils.js'
import globalState from '../globalState.js'

/**
 * If `timer` parameter is set, returns number of milliseconds of timer remained.
 * Otherwise, returns undefined.
 */
export const getTimerLeft = () => {
  return globalState.timeout && globalState.timeout.getTimerLeft()
}

/**
 * Stop timer. Returns number of milliseconds of timer remained.
 * If `timer` parameter isn't set, returns undefined.
 */
export const stopTimer = () => {
  if (globalState.timeout) {
    stopTimerProgressBar()
    return globalState.timeout.stop()
  }
}

/**
 * Resume timer. Returns number of milliseconds of timer remained.
 * If `timer` parameter isn't set, returns undefined.
 */
export const resumeTimer = () => {
  if (globalState.timeout) {
    const remaining = globalState.timeout.start()
    animateTimerProgressBar(remaining)
    return remaining
  }
}

/**
 * Resume timer. Returns number of milliseconds of timer remained.
 * If `timer` parameter isn't set, returns undefined.
 */
export const toggleTimer = () => {
  const timer = globalState.timeout
  return timer && (timer.running ? stopTimer() : resumeTimer())
}

/**
 * Increase timer. Returns number of milliseconds of an updated timer.
 * If `timer` parameter isn't set, returns undefined.
 */
export const increaseTimer = (n) => {
  return globalState.timeout && globalState.timeout.increase(n)
}

/**
 * Check if timer is running. Returns true if timer is running
 * or false if timer is paused or stopped.
 * If `timer` parameter isn't set, returns undefined
 */
export const isTimerRunning = () => {
  return globalState.timeout && globalState.timeout.isRunning()
}
