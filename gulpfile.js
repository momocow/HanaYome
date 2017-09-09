const gulp = require('gulp')
const taskList = require('gulp-task-listing');
const minify = require("gulp-babel-minify");
const fs = require('fs-extra')
const htmlmin = require('gulp-html-minifier')
const zip = require('gulp-zip')
const _ = require("lodash")
const ts = require('gulp-typescript');

// gulp scripts
const pack = require("./gulp-scripts/packaging")
const ticker = require("./gulp-scripts/version-ticker")
const {sync} = require("./gulp-scripts/pkg-sync")

const INFO = require("./package")
const SRC_DIR = "./src"
const BUILD_DIR = "./build"

/**
 * Versioning
 */
 gulp.task('tick:major', function(){
   console.log(ticker.major())
 })

 gulp.task('tick:minor', function(){
   console.log(ticker.minor())
 })

 gulp.task('tick:patch', function(){
   console.log(ticker.patch())
 })

 gulp.task('tick:stage', function(){
   console.log(ticker.stage())
 })

 /**
  * Build
  */
gulp.task('build:build-init', function(){
  gulp.src([`${SRC_DIR}/**/*`, `!${SRC_DIR}/**/*.ts`])
    .pipe(gulp.dest(`${BUILD_DIR}/src`))
})

gulp.task('build:compile', ['build:build-init'], function(){
  return gulp.src(`${SRC_DIR}/**/*.ts`)
    .pipe(ts({
        "allowJs": true,
        "target": "es5"
    }))
    .pipe(gulp.dest(`${BUILD_DIR}/src`))
})

gulp.task('build:minify-html', ['build:build-init'], function(){
  return gulp.src(`${BUILD_DIR}/src/**/*.html`)
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest(`${BUILD_DIR}/src`))
})

gulp.task('build:minify-js', ['build:compile'], function(){
  // option 'base' is provided to overwrite files
  return gulp.src(`${BUILD_DIR}/src/**/*.js`)
    .pipe(minify())
    .pipe(gulp.dest(`${BUILD_DIR}/src`))
})

gulp.task('build:build', ['build:minify-html', 'build:minify-js'], function(){
  sync()
  pack(`${BUILD_DIR}/src`, `./dist`).then(function(){
    console.log(`${INFO.productName || INFO.name} v${INFO.version} is built`)
  })
})

// gulp.task('release', ['package'], function(){
//
// })

gulp.task('build:clean', function(){
  fs.emptyDirSync("./build")
})

/**
 * Util
 */
gulp.task('help', taskList)
gulp.task('default', function(){
  console.log('Use "gulp help" for more information')
})
