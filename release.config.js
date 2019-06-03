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
      'path': '@semantic-release/exec',
      'cmd': 'VERSION=${nextRelease.version} node tools/build-dist'
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
    // remove the "dist" folder from repo, it was added by the build-dist.js script in order to be included to a GitHub release
    {
      'path': '@semantic-release/exec',
      'cmd': 'git rm dist && git commit --amend --no-edit && git push --force-with-lease'
    },
    {
      'path': '@semantic-release/exec',
      'cmd': 'node tools/purge-jsdelivr'
    },
  ]
}
