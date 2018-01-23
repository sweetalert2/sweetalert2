module.exports = function (config) {
  config.set({
    frameworks: ['qunit'],
    reporters: ['spec'],
    files: [
      'node_modules/jquery/dist/jquery.min.js',
      'dist/sweetalert2.css',
      'dist/sweetalert2.js',
      'test/qunit/**/*.js'
    ],
    plugins: [
      'karma-qunit',
      'karma-spec-reporter',
      'karma-chrome-launcher',
      'karma-firefox-launcher'
    ]
  })
}
