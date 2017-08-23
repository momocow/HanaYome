const gulp = require('gulp')
const taskList = require('gulp-task-listing');
const minify = require("gulp-babel-minify");
const fs = require('fs-extra')
const htmlmin = require('gulp-html-minifier')
const zip = require('gulp-zip')
const _ = require("lodash")

// gulp scripts
const pack = require("./gulp-scripts/packaging")
const ticker = require("./gulp-scripts/version-ticker")
const {sync} = require("./gulp-scripts/pkg-sync")

const INFO = require("./package")

/**
 * Versioning
 */
 gulp.task('major', function(){
   console.log(ticker.major())
 })

 gulp.task('minor', function(){
   console.log(ticker.minor())
 })

 gulp.task('patch', function(){
   console.log(ticker.patch())
 })

 gulp.task('stage', function(){
   console.log(ticker.stage())
 })

 /**
  * Build
  */
gulp.task('build-init', ['clean'], function(){
  fs.copySync("./src", "./build/src")
})

gulp.task('minify-html', ['build-init'], function(){
  return gulp.src('build/src/**/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('build/src'))
})

gulp.task('minify-js', ['build-init'], function(){
  // option 'base' is provided to overwrite files
  return gulp.src("build/src/**/*.js")
    .pipe(minify())
    .pipe(gulp.dest("build/src"))
})

gulp.task('sync', function(){
  sync()
})

gulp.task('package', ['minify-html', 'minify-js', 'sync'], function(){
  return pack()
})

gulp.task('build', ['package'], function(){
  console.log(`${INFO.productName || INFO.name} v${INFO.version} is built`)
})

// gulp.task('release', ['package'], function(){
//
// })

gulp.task('clean', function(){
  fs.removeSync("./build/")
})

/**
 * Util
 */
gulp.task('help', taskList)
gulp.task('default', function(){
  console.log('Use "gulp help" for more information')
})
