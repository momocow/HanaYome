const gulp = require('gulp')
const taskList = require('gulp-task-listing')
const builder = require('electron-builder')
const minify = require("gulp-babel-minify")
const fs = require('fs-extra')
const htmlmin = require('gulp-htmlmin')
const cleanCSS = require('gulp-clean-css')
const zip = require('gulp-zip')
const _ = require("lodash")
const ts = require('gulp-typescript')
const promise = require('bluebird')
const install = require('gulp-yarn')
const dir = require('node-dir')
const path = require('path')
const srcmap = require('gulp-sourcemaps')

const INFO = require("./package")
const INFO_DEV_ONLY = ['devDependencies', 'build', 'nyc', 'scripts.test', 'scripts.build']
const SRC_DIR = "./src"
const BUNDLES = ['./assets/config/**/*']
const BUILD_DIR = "./app"
const PRETTY_DIR = "./pretty"

function log(msg, ...args){
    console.log(`  ${msg}`, ...args)
}

 /**
    * Build
    */
gulp.task('build:init', function(){
    let productPack = _.cloneDeep(INFO)
    for(let devInfo of INFO_DEV_ONLY){
        if(_.unset(productPack, devInfo)){
            log(`- '${devInfo}' is deleted.`)
        }
    }
    fs.outputJsonSync(`${BUILD_DIR}/package.json`, productPack, {spaces: 4})
    log('Package.json for production is created.')

    gulp.src(BUNDLES, {base: './'}).pipe(gulp.dest(BUILD_DIR))

    return gulp.src([`${SRC_DIR}/**/*`, `!${SRC_DIR}/**/*.ts`], {base: SRC_DIR})
        .pipe(gulp.dest(BUILD_DIR))
})

gulp.task('build:js', ['build:init'], function(){
  let opt = fs.readJSONSync('./tsconfig.json').compilerOptions
  console.log(`Use typescript compiler options from ./tsconfig.json`)
  console.log(opt)
  return gulp.src([`${SRC_DIR}/**/*.ts`], {base: SRC_DIR})
      .pipe(srcmap.init())
          .pipe(ts(opt))
          .pipe(minify())
      .pipe(srcmap.write())
      .pipe(gulp.dest(BUILD_DIR))
})

gulp.task('build:html', ['build:init'], function(){
    return gulp.src(`${BUILD_DIR}/**/*.html`, {base: BUILD_DIR})
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(BUILD_DIR))
})

gulp.task('build:css', ['build:init'], function(){
    return gulp.src(`${BUILD_DIR}/**/*.css`, {base: BUILD_DIR})
        .pipe(srcmap.init())
            .pipe(cleanCSS())
        .pipe(srcmap.write())
        .pipe(gulp.dest(BUILD_DIR))
})

gulp.task('build:dependencies', ['build:init'], function(){
    return gulp.src([`${BUILD_DIR}/package.json`])
        .pipe(install({
            production: true
        }))
})

gulp.task('build:app', ['build:html', 'build:js', 'build:css', 'build:dependencies'], function(){
    console.log('App is built.')
})

gulp.task('build:release', ['build:app'], function(){
    return builder.build().then(function(){
        console.log('Finish creating releases')
    })
})

gulp.task('build:pretty', function(){
    let opt = fs.readJSONSync('./tsconfig.json').compilerOptions
    console.log(`Use typescript compiler options from ./tsconfig.json`)
    console.log(opt)
    return gulp.src([`${SRC_DIR}/**/*.ts`], {base: SRC_DIR})
        .pipe(srcmap.init())
            .pipe(ts(opt))
        .pipe(srcmap.write())
        .pipe(gulp.dest(PRETTY_DIR))
})

gulp.task('build:clean-pretty', function(){
    fs.emptyDirSync(PRETTY_DIR)
})

gulp.task('build:clean', function(){
    fs.emptyDirSync(BUILD_DIR)
})

/**
 * Util
 */
gulp.task('help', taskList)
gulp.task('default', function(){
    console.log('Use "gulp help" for more information')
})
