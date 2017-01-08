const gulp = require('gulp')
const cleanCSS = require('gulp-clean-css')
const sass = require('gulp-sass')
const rename = require('gulp-rename')
const autoprefix = require('gulp-autoprefixer')
const standard = require('gulp-standard')
const sassLint = require('gulp-sass-lint')

const pack = require('./package.json')
const utils = require('./config/utils.js')

gulp.task('compress', ['js-lint', 'commonjs', 'dev', 'production'])

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

gulp.task('production', () => {
  return utils.packageRollup({
    dest: 'dist/' + pack.name + '.min.js',
    format: 'umd',
    minify: true
  })
})

gulp.task('sass', ['sass-lint'], () => {
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

gulp.task('lint', ['js-lint', 'sass-lint'])

gulp.task('js-lint', () => {
  return gulp.src(['src/**/*.js', 'test/*.js'])
    .pipe(standard())
    .pipe(standard.reporter('default', {
      breakOnError: true
    }))
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
  ], ['compress'])

  gulp.watch([
    'src/sweetalert2.scss',
    'assets/example.scss'
  ], ['sass'])
})
