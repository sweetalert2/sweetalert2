const gulp = require('gulp')
const gutil = require('gulp-util')
const $ = require('gulp-load-plugins')()
const eslint = require('gulp-eslint')
const babel = require('rollup-plugin-babel')
const json = require('rollup-plugin-json')
const merge = require('merge2')
const browserSync = require('browser-sync').create()
const pify = require('pify')
const rimraf = require('rimraf')
const mkdirp = require('mkdirp')
const packageJson = require('./package.json')
const execute = require('./utils/execute')
const log = require('fancy-log')
const version = process.env.VERSION || packageJson.version

const banner = `/*!
* ${packageJson.name} v${version}
* Released under the ${packageJson.license} License.
*/`

const allScriptFiles = ['**/*.js', '!dist/**', '!node_modules/**']
const srcScriptFiles = ['src/**/*.js']
const srcStyleFiles = ['src/**/*.scss']
const tsFiles = ['sweetalert2.d.ts']

const continueOnError = process.argv.includes('--continue-on-error')
const skipMinification = process.argv.includes('--skip-minification')
const skipStandalone = process.argv.includes('--skip-standalone')

const removeDir = pify(rimraf)
const createDir = pify(mkdirp)

// ---

gulp.task('clean', async () => {
  await removeDir('dist')
  await createDir('dist')
})

gulp.task('build:scripts', () => {
  return gulp.src(['package.json', ...srcScriptFiles])
    .pipe($.rollup({
      plugins: [
        json(),
        babel({
          exclude: 'node_modules/**'
        })
      ],
      input: 'src/sweetalert2.js',
      output: {
        format: 'umd',
        name: 'Sweetalert2',
        banner: banner,
        footer: `\
if (typeof window !== 'undefined' && window.Sweetalert2){\
  window.Sweetalert2.version = '${version}';\
  window.swal = window.sweetAlert = window.Swal = window.SweetAlert = window.Sweetalert2\
}`
      }
    }))
    .on('error', (error) => {
      if (continueOnError) {
        log(error)
      } else {
        throw error
      }
    })
    .pipe(gulp.dest('dist'))
    .pipe($.if(!skipMinification, $.uglify()))
    .pipe($.if(!skipMinification, $.rename('sweetalert2.min.js')))
    .pipe($.if(!skipMinification, gulp.dest('dist')))
})

gulp.task('build:styles', () => {
  return gulp.src('src/sweetalert2.scss')
    .pipe($.sass())
    .pipe($.autoprefixer())
    .pipe(gulp.dest('dist'))
    .pipe($.if(!skipMinification, $.cleanCss()))
    .pipe($.if(!skipMinification, $.rename('sweetalert2.min.css')))
    .pipe($.if(!skipMinification, gulp.dest('dist')))
})

/**
 * Warning: This task depends on dist/sweetalert2.js & dist/sweetalert2.css
 */
gulp.task('build:standalone', () => {
  const prettyJs = gulp.src('dist/sweetalert2.js')
  const prettyCssAsJs = gulp.src('dist/sweetalert2.min.css')
    .pipe($.css2js())
  const prettyStandalone = merge(prettyJs, prettyCssAsJs)
    .pipe($.concat('sweetalert2.all.js'))
    .pipe(gulp.dest('dist'))
  if (skipMinification) {
    return prettyStandalone
  } else {
    const uglyJs = gulp.src('dist/sweetalert2.min.js')
    const uglyCssAsJs = gulp.src('dist/sweetalert2.min.css')
      .pipe($.css2js())
    const uglyStandalone = merge(uglyJs, uglyCssAsJs)
      .pipe($.concat('sweetalert2.all.min.js'))
      .pipe(gulp.dest('dist'))
    return merge([prettyStandalone, uglyStandalone])
  }
})

gulp.task('build', gulp.series(
  'clean',
  gulp.parallel('build:scripts', 'build:styles'),
  ...(skipStandalone ? [] : ['build:standalone'])
))

gulp.task('default', gulp.parallel('build'))

// ---

gulp.task('lint:scripts', () => {
  return gulp.src(allScriptFiles)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(continueOnError ? gutil.noop() : eslint.failAfterError())
})

gulp.task('lint:styles', () => {
  return gulp.src(srcStyleFiles)
    .pipe($.sassLint())
    .pipe($.sassLint.format())
    .pipe($.if(!continueOnError, $.sassLint.failOnError()))
})

gulp.task('lint:ts', () => {
  return gulp.src(tsFiles)
    .pipe($.typescript({ lib: ['es6', 'dom'] }))
    .pipe($.tslint({ formatter: 'verbose' }))
    .pipe($.tslint.report({
      emitError: !continueOnError
    }))
})

gulp.task('lint', gulp.parallel('lint:scripts', 'lint:styles', 'lint:ts'))

// ---

gulp.task('develop', gulp.series(
  gulp.parallel('lint', 'build'),
  async function watch () {
    // Does not rebuild standalone files, for speed in active development
    gulp.watch(srcScriptFiles, gulp.parallel('build:scripts'))
    gulp.watch(srcStyleFiles, gulp.parallel('build:styles'))
    gulp.watch(allScriptFiles, gulp.parallel('lint:scripts'))
    gulp.watch(srcStyleFiles, gulp.parallel('lint:styles'))
    gulp.watch(tsFiles, gulp.parallel('lint:ts'))
  },
  async function sandbox () {
    browserSync.init({
      port: 8080,
      uiPort: 8081,
      notify: false,
      reloadOnRestart: true,
      https: false,
      server: ['./'],
      startPath: 'test/sandbox.html'
    })
    gulp.watch([
      'test/sandbox.html',
      'dist/sweetalert2.js',
      'dist/sweetalert2.css'
    ]).on('change', browserSync.reload)
  },
  async function tests () {
    await execute(`karma start karma.conf.js --no-launch`)
  }
))
