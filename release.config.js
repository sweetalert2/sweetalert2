module.exports = {
  debug: true,
  branch: 'master',
  verifyConditions: [
    '@semantic-release/changelog',
    '@semantic-release/npm',
    '@semantic-release/github',
  ],
  prepare: [
    {
      path: '@semantic-release/exec',
      cmd: 'VERSION=${nextRelease.version} node tools/build-dist' // eslint-disable-line no-template-curly-in-string
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
      path: '@semantic-release/exec',
      cmd: 'node tools/purge-jsdelivr'
    },
  ]
}
