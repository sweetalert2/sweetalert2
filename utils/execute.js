const execa = require('execa')


const Stream = require('stream').Stream
const split = require('split') // dominictarr
const map = require('map-stream') //dominictarr 

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

module.exports = function execute (command, { skipLogging } = {}) {
  const proc = execa.shell(command)
  console.log('running execute....')
  if (!skipLogging) {
    const formatLine = (line, label) => `    (pid:${proc.pid})\t[${label}]\t${line}\n`
    const formatStream = (stream, label) => stream
      .pipe(split())
      .pipe(map((line, cb) => cb(null, formatLine(line, label))))

    process.stdout.write(formatLine(command, 'cmd'))
    merge(formatStream(proc.stdout, 'out'), formatStream(proc.stderr, 'ERR'))
      .pipe(process.stdout)
  }

  return proc
}
