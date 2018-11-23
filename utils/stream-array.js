
const Stream = require('stream').Stream
const { Duplex } = require('stream')
const map = require('map-stream') //dominictarr package

function split () {
  const stream = new Duplex({
    write (chunk, encoding, callback) {
      this.buffer = (this.buffer || '') + chunk.toString()
      if (/\r?\n/.test(chunk.toString())) {
        let splitChunks = this.buffer.split(/\r?\n/)
        for (let i = 0; i < splitChunks.length - 1; i++) {
          this.push(splitChunks[i])
        }        
        this.buffer = splitChunks[splitChunks.length -1]
      }
      callback()
    },
    read () {}
  })
  return stream
}

function merge (/*streams...*/) {
  let toMerge = [].slice.call(arguments)
  if (toMerge.length === 1 && (toMerge[0] instanceof Array)) {
    toMerge = toMerge[0] //handle array as arguments object
  }
  let stream = new Stream()
  stream.setMaxListeners(0) // allow adding more than 11 streams
  let endCount = 0
  stream.writable = stream.readable = true

  if (toMerge.length) {
    toMerge.forEach(function (e) {
      e.pipe(stream, { end: false })
      let ended = false
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
