export default class Timer {
  constructor (callback, delay) {
    var id, started, running
    var remaining = delay
    this.start = function () {
      running = true
      started = new Date()
      id = setTimeout(callback, remaining)
    }
    this.stop = function () {
      running = false
      clearTimeout(id)
      remaining -= new Date() - started
    }
    this.getTimerLeft = function () {
      if (running) {
        this.stop()
        this.start()
      }
      return remaining
    }
    this.getStateRunning = function () {
      return running
    }
    this.start()
  }
}
