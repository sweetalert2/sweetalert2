const gulp = require('gulp')
const cleanCSS = require('gulp-clean-css')
const sass = require('gulp-sass')
const rename = require('gulp-rename')
const autoprefix = require('gulp-autoprefixer')
const standard = require('gulp-standard')
const sassLint = require('gulp-sass-lint')
const qunit = require('gulp-qunit')

const pack = require('./package.json')
const utils = require('./config/utils.js')

gulp.task('compress', ['standard', 'commonjs', 'dev', 'production'])

gulp.task('standard', () => {
  return gulp.src(['src/**/*.js', 'test/*.js'])
    .pipe(standard())
    .pipe(standard.reporter('default', {
      breakOnError: true
    }))
})

gulp.task('commonjs', () => {
  return utils.packageRollup({
    dest: 'dist/' + pack.name + '.common.js',
    format: 'cjs'
  })
})

gulp.task('dev', () => {
  return utils.packageRollup({
    dest: 'dist/' + pack.name + '.js',
    format: 'umd'
  })
})

gulp.task('test', () => {
  return gulp.src('./test/test-runner.html')
    .pipe(qunit())
    .on('error', function (err) { // avoid the ugly error message on failing
      if (process.env.CI) { // but still fail if we're running in a CI
        throw err
      } else if (err.name !== "Error" || err.code !== 1) {
        // rather crude filter
        // this blocks the 'Command failed' error every time gulp-qunit fails
        // logs all other errors without breaking the watcher
        console.error(err.toString())
      }
      this.emit('end')
    })
})

gulp.task('production', () => {
  return utils.packageRollup({
    dest: 'dist/' + pack.name + '.min.js',
    format: 'umd',
    minify: true
  })
})

gulp.task('sass', () => {
  gulp.src('src/sweetalert2.scss')
    .pipe(sass())
    .pipe(autoprefix())
    .pipe(gulp.dest('dist'))
    .pipe(cleanCSS())
    .pipe(rename({extname: '.min.css'}))
    .pipe(gulp.dest('dist'))

  gulp.src('assets/example.scss')
    .pipe(sass())
    .pipe(autoprefix())
    .pipe(gulp.dest('assets'))
})

gulp.task('sass-lint', () => {
  return gulp.src(['src/**/*.scss', 'assets/**/*.scss'])
    .pipe(sassLint())
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError())
})

gulp.task('default', ['compress', 'sass'])

gulp.task('watch', () => {
  gulp.watch([
    'src/**/*.js',
    'test/*.js'
  ], ['compress', 'test'])

  gulp.watch([
    'src/sweetalert2.scss',
    'assets/example.scss'
  ], ['sass-lint', 'sass'])
})
