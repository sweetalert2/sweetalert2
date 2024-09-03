module.exports = {
  debug: true,
  branches: ['main'],
  verifyConditions: ['@semantic-release/changelog', '@semantic-release/npm', '@semantic-release/github'],
  prepare: [
    {
      path: '@semantic-release/exec',
      cmd: 'VERSION=${nextRelease.version} ./node_modules/.bin/zx tools/build-dist.mjs',
    },
    '@semantic-release/changelog',
    '@semantic-release/npm',
    '@semantic-release/git',
  ],
  publish: [
    '@semantic-release/npm',
    [
      '@semantic-release/github',
      {
        assets: [
          { path: 'dist/sweetalert2.all.js' },
          { path: 'dist/sweetalert2.all.min.js' },
          { path: 'dist/sweetalert2.css' },
          { path: 'dist/sweetalert2.esm.all.js' },
          { path: 'dist/sweetalert2.esm.all.min.js' },
          { path: 'dist/sweetalert2.esm.js' },
          { path: 'dist/sweetalert2.esm.min.js' },
          { path: 'dist/sweetalert2.js' },
          { path: 'dist/sweetalert2.min.css' },
          { path: 'dist/sweetalert2.min.js' },
        ],
      },
    ],
  ],
  success: [
    '@semantic-release/github',
    {
      path: '@semantic-release/exec',
      cmd: './node_modules/.bin/zx tools/purge-jsdelivr.mjs',
    },
  ],
}
