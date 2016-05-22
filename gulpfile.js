var gulp = require('gulp'),
    uglify     = require('gulp-uglify'),
    cleanCSS   = require('gulp-clean-css'),
    sass       = require('gulp-sass'),
    rename     = require('gulp-rename'),
    autoprefix = require('gulp-autoprefixer');

var pack  = require('./package.json');
var utils = require('./config/utils.js');

gulp.task('compress', ['commonjs', 'dev', 'production']);
gulp.task('default', ['compress', 'sass']);

gulp.task('commonjs', function() {
  return utils.packageRollup({
    dest: 'dist/' + pack.name + '.common.js',
    format: 'cjs'
  });
});

gulp.task('dev', function() {
  return utils.packageRollup({
    dest:   'dist/' + pack.name + '.js',
    format: 'umd',
  });
});

gulp.task('production', function() {
  return utils.packageRollup({
    dest:   'dist/' + pack.name + '.min.js',
    format: 'umd',
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

gulp.task('watch', function() {
  gulp.watch('src/*.js', ['compress']);
  gulp.watch('**/*.scss', ['sass']);
});
