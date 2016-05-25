var gulp = require('gulp'),
    uglify     = require('gulp-uglify'),
    cleanCSS   = require('gulp-clean-css'),
    sass       = require('gulp-sass'),
    rename     = require('gulp-rename'),
    autoprefix = require('gulp-autoprefixer'),
    qunit      = require('gulp-qunit');

var pack  = require('./package.json');
var utils = require('./config/utils.js');

gulp.task('compress', ['commonjs', 'dev', 'production']);

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
});

gulp.task('default', ['compress', 'sass']);

gulp.task('watch', function() {
  gulp.watch('src/*.js', ['compress']);
  gulp.watch('**/*.scss', ['sass']);
});
