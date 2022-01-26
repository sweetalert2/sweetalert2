import gulp from 'gulp'
import rollup from 'gulp-rollup'
import gulpif from 'gulp-if'
import uglify from 'gulp-uglify'
import rename from 'gulp-rename'
import css2js from 'gulp-css2js'
import concat from 'gulp-concat'
import autoprefixer from 'gulp-autoprefixer'
import cleanCss from 'gulp-clean-css'
import babel from 'rollup-plugin-babel'
import json from '@rollup/plugin-json'
import merge from 'merge2'
import sass from 'sass'
import browserSync from 'browser-sync'
import log from 'fancy-log'
import fs from 'fs'

const packageJson = JSON.parse(fs.readFileSync('package.json'))
const version = process.env.VERSION || packageJson.version

const banner = `/*!
* ${packageJson.name} v${version}
* Released under the ${packageJson.license} License.
*/`

const srcScriptFiles = ['src/**/*.js']
const srcStyleFiles = ['src/**/*.scss']

const continueOnError = process.argv.includes('--continue-on-error')
const skipMinification = process.argv.includes('--skip-minification')
const skipStandalone = process.argv.includes('--skip-standalone')

// ---

gulp.task('clean', () => {
  if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist')
  }

  return fs.promises
    .readdir('dist')
    .then((fileList) => {
      if (fileList.length > 0) {
        const unlinkPromises = []
        fileList.forEach((fileName) => {
          unlinkPromises.push(fs.promises.unlink(`dist/${fileName}`))
        })
        return Promise.all(unlinkPromises)
      }
    })
    .catch((error) => {
      if (error.code !== 'ENOENT') {
        return Promise.reject(error)
      }
    })
})

gulp.task('build:scripts', () => {
  return gulp
    .src(['package.json', ...srcScriptFiles])
    .pipe(
      rollup({
        plugins: [
          json(),
          babel({
            exclude: 'node_modules/**',
          }),
        ],
        input: 'src/sweetalert2.js',
        output: {
          format: 'umd',
          name: 'Sweetalert2',
          banner: banner,
          footer: `\
if (typeof this !== 'undefined' && this.Sweetalert2){\
  this.swal = this.sweetAlert = this.Swal = this.SweetAlert = this.Sweetalert2\
}`,
        },
        // https://github.com/rollup/rollup/issues/2271
        onwarn(warning, rollupWarn) {
          if (warning.code !== 'CIRCULAR_DEPENDENCY' && warning.code !== 'THIS_IS_UNDEFINED') {
            rollupWarn(warning)
          }
        },
      })
    )
    .on('error', (error) => {
      if (continueOnError) {
        log(error)
      } else {
        throw error
      }
    })
    .pipe(gulp.dest('dist'))
    .pipe(gulpif(!skipMinification, uglify()))
    .pipe(gulpif(!skipMinification, rename('sweetalert2.min.js')))
    .pipe(gulpif(!skipMinification, gulp.dest('dist')))
})

gulp.task('build:styles', () => {
  const result = sass.renderSync({ file: 'src/sweetalert2.scss' })
  fs.writeFileSync('dist/sweetalert2.css', result.css)

  return gulp
    .src('dist/sweetalert2.css')
    .pipe(autoprefixer())
    .pipe(gulp.dest('dist'))
    .pipe(gulpif(!skipMinification, cleanCss()))
    .pipe(gulpif(!skipMinification, rename('sweetalert2.min.css')))
    .pipe(gulpif(!skipMinification, gulp.dest('dist')))
})

/**
 * Warning: This task depends on dist/sweetalert2.js & dist/sweetalert2.css
 */
gulp.task('build:standalone', () => {
  const prettyJs = gulp.src('dist/sweetalert2.js')
  const prettyCssAsJs = gulp.src('dist/sweetalert2.min.css').pipe(css2js())
  const prettyStandalone = merge(prettyJs, prettyCssAsJs).pipe(concat('sweetalert2.all.js')).pipe(gulp.dest('dist'))
  if (skipMinification) {
    return prettyStandalone
  } else {
    const uglyJs = gulp.src('dist/sweetalert2.min.js')
    const uglyCssAsJs = gulp.src('dist/sweetalert2.min.css').pipe(css2js())
    const uglyStandalone = merge(uglyJs, uglyCssAsJs).pipe(concat('sweetalert2.all.min.js')).pipe(gulp.dest('dist'))
    return merge([prettyStandalone, uglyStandalone])
  }
})

gulp.task(
  'build',
  gulp.series('clean', gulp.parallel('build:scripts', 'build:styles'), ...(skipStandalone ? [] : ['build:standalone']))
)

gulp.task('default', gulp.parallel('build'))

// ---

gulp.task(
  'develop',
  gulp.series(
    'build',
    async function watch() {
      // Does not rebuild standalone files, for speed in active development
      gulp.watch(srcScriptFiles, gulp.parallel('build:scripts'))
      gulp.watch(srcStyleFiles, gulp.parallel('build:styles'))
    },
    async function sandbox() {
      browserSync.init({
        port: 8080,
        uiPort: 8081,
        notify: false,
        reloadOnRestart: true,
        https: false,
        server: ['./'],
        startPath: 'test/sandbox.html',
      })
      gulp.watch(['test/sandbox.html', 'dist/sweetalert2.js', 'dist/sweetalert2.css']).on('change', browserSync.reload)
    }
  )
)
