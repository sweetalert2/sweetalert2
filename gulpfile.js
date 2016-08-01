var gulp = require('gulp'),
    cleanCSS   = require('gulp-clean-css'),
    sass       = require('gulp-sass'),
    rename     = require('gulp-rename'),
    autoprefix = require('gulp-autoprefixer'),
    eslint     = require('gulp-eslint'),
    qunit      = require('gulp-qunit');

var pack  = require('./package.json');
var utils = require('./config/utils.js');

gulp.task('compress', ['lint', 'commonjs', 'dev', 'production']);

gulp.task('lint', function() {
  return gulp.src(['src/*.js', 'test/*.js'])
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
    .pipe(qunit());
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
    'src/sweetalert2.js',
    'src/utils/classes.js',
    'src/utils/default.js',
    'src/utils/dom.js',
    'src/utils/utils.js',
    'src/utils/classes.js'
  ], ['compress']);

  gulp.watch([
    'src/sweetalert2.scss',
    'example/example.scss'
  ], ['sass']);
});
