module.exports = {
  debug: true,
  branch: 'dist',
  verifyConditions: [
    '@semantic-release/changelog',
    '@semantic-release/npm',
    '@semantic-release/github',
  ],
  prepare: [
    '@semantic-release/changelog',
    '@semantic-release/npm',
    '@semantic-release/git',
  ],
  publish: [
    {
      'path': '@semantic-release/exec',
      'cmd': 'node tools/build-dist ${nextRelease.version}'
    },
    '@semantic-release/npm',
    '@semantic-release/github',
  ],
  success: [
    '@semantic-release/github',
    {
      'path': '@semantic-release/exec',
      'cmd': 'node tools/cherry-pick-release-to-master'
    },
  ]
}
