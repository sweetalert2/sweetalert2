const execa = require('execa')
const es = require('event-stream')

module.exports = function execute (command, {skipLogging} = {}) {
  const proc = execa.shell(command)

  if (!skipLogging) {
    const formatLine = (line, label) => `    (pid:${proc.pid})\t[${label}]\t${line}\n`
    const formatStream = (stream, label) => stream
      .pipe(es.split())
      .pipe(es.map((line, cb) => cb(null, formatLine(line, label))))

    process.stdout.write(formatLine(command, 'cmd'))
    es.merge(formatStream(proc.stdout, 'out'), formatStream(proc.stderr, 'ERR'))
      .pipe(process.stdout)
  }

  return proc
}
