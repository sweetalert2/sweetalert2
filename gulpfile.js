const gulp = require('gulp')
const cleanCSS = require('gulp-clean-css')
const sass = require('gulp-sass')
const rename = require('gulp-rename')
const autoprefix = require('gulp-autoprefixer')
const standard = require('gulp-standard')
const sassLint = require('gulp-sass-lint')
const tslint = require('gulp-tslint')
const gulpIf = require('gulp-if')
const execa = require('execa')
const touch = require('touch')
const pify = require('pify')
const packageRollup = require('./util/packageRollup')

// to pass "dist" flag
//    /w gulp task runner: `gulp build --dist`
//    /w npm task runner: `npm run build -- --dist (npm appends everything after `--` to the selected script)
const dist = process.argv.includes('--dist')

const allJsFiles = ['**/*.js', '!dist/**', '!node_modules/**']
const srcJsFiles = ['src/**/*.js']
const sassFiles = ['src/**/*.scss']
const tsFiles = ['sweetalert2.d.ts']

const touchAsync = pify(touch)

// ---

gulp.task('lint:js', () => {
  return gulp.src(allJsFiles)
    .pipe(standard())
    .pipe(standard.reporter('default', {
      breakOnError: true
    }))
})

gulp.task('lint:sass', () => {
  return gulp.src(sassFiles)
    .pipe(sassLint())
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError())
})

gulp.task('lint:ts', () => {
  return gulp.src(tsFiles)
    .pipe(tslint({formatter: 'verbose'}))
    .pipe(tslint.report())
})

gulp.task('lint', gulp.parallel(['lint:js', 'lint:sass', 'lint:ts']))

// ---

gulp.task('build:js', () => {
  return Promise.all([
    packageRollup({
      entry: 'src/sweetalert2.js',
      dest: 'dist/sweetalert2.js',
      format: 'umd'
    }),
    ...(dist ? [
      packageRollup({
        entry: 'src/sweetalert2.js',
        dest: 'dist/sweetalert2.min.js',
        format: 'umd',
        minify: true
      }),
      packageRollup({
        entry: 'src/sweetalert2.all.js',
        dest: 'dist/sweetalert2.all.js',
        format: 'umd'
      }),
      packageRollup({
        entry: 'src/sweetalert2.all.js',
        dest: 'dist/sweetalert2.all.min.js',
        format: 'umd',
        minify: true
      })
    ] : [])
  ])
})

gulp.task('build:sass', () => {
  return gulp.src('src/sweetalert2.scss')
    .pipe(sass())
    .pipe(gulpIf(dist, autoprefix()))
    .pipe(gulp.dest('dist'))
    .pipe(gulpIf(dist, cleanCSS()))
    .pipe(gulpIf(dist, rename({extname: '.min.css'})))
    .pipe(gulpIf(dist, gulp.dest('dist')))
})

gulp.task('build', gulp.parallel(['build:js', 'build:sass']))

gulp.task('default', gulp.parallel(['build']))

// ---

function triggerTestReload () {
  return touchAsync('test/touch-me-to-trigger-test-reload')
}

gulp.task('dev', gulp.series([
  'build',
  async function watch () {
    gulp.watch(srcJsFiles, gulp.series(['build:js', triggerTestReload]))
    gulp.watch(sassFiles, gulp.series(['build:sass', triggerTestReload]))
    gulp.watch(allJsFiles, gulp.series(['lint:js']))
    gulp.watch(sassFiles, gulp.series('lint:sass'))
    gulp.watch(tsFiles, gulp.series('lint:ts'))
  },
  async function test () {
    const testemPromise = execa('testem')
    console.log('Open testem: http://localhost:8080/')
    await testemPromise
  }
]))
