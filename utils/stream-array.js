
const Stream = require('stream').Stream
const split = require('split') // dominictarr package
const map = require('map-stream') //dominictarr package

function merge (/*streams...*/) {
  var toMerge = [].slice.call(arguments)
  if (toMerge.length === 1 && (toMerge[0] instanceof Array)) {
    toMerge = toMerge[0] //handle array as arguments object
  }
  var stream = new Stream()
  stream.setMaxListeners(0) // allow adding more than 11 streams
  var endCount = 0
  stream.writable = stream.readable = true

  if (toMerge.length) {
    toMerge.forEach(function (e) {
      e.pipe(stream, {end: false})
      var ended = false
      e.on('end', function () {
        if(ended) return
        ended = true
        endCount ++
        if(endCount == toMerge.length)
          stream.emit('end')
      })
    })
  } else {
    process.nextTick(function () {
      stream.emit('end')
    })
  }
  
  stream.write = function (data) {
    this.emit('data', data)
  }
  stream.destroy = function () {
    toMerge.forEach(function (e) {
      if(e.destroy) e.destroy()
    })
  }
  return stream
}

module.exports = {
  split: split,
  map: map,
  merge: merge
}
