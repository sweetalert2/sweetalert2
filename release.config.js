module.exports = {
  debug: true,
  verifyConditions: [
    '@semantic-release/changelog',
  ],
  prepare: [
    '@semantic-release/changelog',
  ],
  publish: [
    {
      'path': '@semantic-release/exec',
      'cmd': 'node release ${nextRelease.version}'
    }
  ]
}
