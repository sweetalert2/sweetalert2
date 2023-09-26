import globalState from '../globalState.js'
import { animateTimerProgressBar, stopTimerProgressBar } from '../utils/dom/domUtils.js'

/**
 * If `timer` parameter is set, returns number of milliseconds of timer remained.
 * Otherwise, returns undefined.
 *
 * @returns {number | undefined}
 */
export const getTimerLeft = () => {
  return globalState.timeout && globalState.timeout.getTimerLeft()
}

/**
 * Stop timer. Returns number of milliseconds of timer remained.
 * If `timer` parameter isn't set, returns undefined.
 *
 * @returns {number | undefined}
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
 *
 * @returns {number | undefined}
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
 *
 * @returns {number | undefined}
 */
export const toggleTimer = () => {
  const timer = globalState.timeout
  return timer && (timer.running ? stopTimer() : resumeTimer())
}

/**
 * Increase timer. Returns number of milliseconds of an updated timer.
 * If `timer` parameter isn't set, returns undefined.
 *
 * @param {number} ms
 * @returns {number | undefined}
 */
export const increaseTimer = (ms) => {
  if (globalState.timeout) {
    const remaining = globalState.timeout.increase(ms)
    animateTimerProgressBar(remaining, true)
    return remaining
  }
}

/**
 * Check if timer is running. Returns true if timer is running
 * or false if timer is paused or stopped.
 * If `timer` parameter isn't set, returns undefined
 *
 * @returns {boolean}
 */
export const isTimerRunning = () => {
  return !!(globalState.timeout && globalState.timeout.isRunning())
}
