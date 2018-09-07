module.exports = {
  debug: true,
  branch: 'dist',
  verifyConditions: [
    '@semantic-release/changelog',
    '@semantic-release/npm',
    '@semantic-release/github',
  ],
  prepare: [
    {
      'path': '@semantic-release/exec',
      'cmd': 'node tools/build-dist ${nextRelease.version}'
    },
    '@semantic-release/changelog',
    '@semantic-release/npm',
    '@semantic-release/git',
  ],
  publish: [
    '@semantic-release/npm',
    '@semantic-release/github',
  ],
  success: [
    '@semantic-release/github',
    {
      'path': '@semantic-release/exec',
      'cmd': 'node tools/purge-jsdelivr'
    },
    {
      'path': '@semantic-release/exec',
      'cmd': 'node tools/cherry-pick-release-to-master'
    },
  ]
}
