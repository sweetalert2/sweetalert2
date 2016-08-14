var gulp       = require('gulp');
var cleanCSS   = require('gulp-clean-css');
var sass       = require('gulp-sass');
var rename     = require('gulp-rename');
var autoprefix = require('gulp-autoprefixer');
var eslint     = require('gulp-eslint');
var qunit      = require('gulp-qunit');

var pack  = require('./package.json');
var utils = require('./config/utils.js');

gulp.task('compress', ['lint', 'commonjs', 'dev', 'production']);

gulp.task('lint', function() {
  return gulp.src(['src/**/*.js', 'test/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('commonjs', function() {
  return utils.packageRollup({
    dest: 'dist/' + pack.name + '.common.js',
    format: 'cjs'
  });
});

gulp.task('dev', function() {
  return utils.packageRollup({
    dest: 'dist/' + pack.name + '.js',
    format: 'umd'
  });
});

gulp.task('test', function() {
  return gulp.src('./test/test-runner.html')
    .pipe(qunit())
    .on('error', function(err){ // avoid the ugly error message on failing
      this.emit('end');
    });
});

gulp.task('production', function() {
  return utils.packageRollup({
    dest: 'dist/' + pack.name + '.min.js',
    format: 'umd',
    minify: true
  }).then(utils.zip);
});

gulp.task('sass', function() {
  gulp.src('src/sweetalert2.scss')
    .pipe(sass())
    .pipe(autoprefix())
    .pipe(gulp.dest('dist'))
    .pipe(cleanCSS())
    .pipe(rename({extname: '.min.css'}))
    .pipe(gulp.dest('dist'));

  gulp.src('example/example.scss')
    .pipe(sass())
    .pipe(autoprefix())
    .pipe(gulp.dest('example'));
});

gulp.task('default', ['compress', 'sass']);

gulp.task('watch', function() {
  gulp.watch([
    'src/**/*.js',
    'test/*.js',
  ], ['compress']);

  gulp.watch([
    'src/sweetalert2.scss',
    'example/example.scss'
  ], ['sass']);
});
