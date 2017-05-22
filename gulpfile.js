const gulp = require('gulp')
const uglify = require('gulp-uglify')
const babel = require('gulp-babel')
const fs = require('fs-extra')
const rm = require('gulp-rimraf')
const ignore = require('gulp-ignore')
const pump = require('pump')
const asar = require('asar')
const htmlmin = require('gulp-html-minifier')

const package_json = require('./package.json')
const package_name = package_json.name
const package_version = package_json.version
const app_files = ['main.js', 'package.json', 'assets/', 'views/', 'models/']
const js_files = ['main.js', 'views/**/*.js', 'models/**/*.js', 'assets/js/**/*.js']

gulp.task('version', ()=>{
  console.log(`*** Start building ${package_name} v${package_version} ***`)
})

gulp.task('uglify', ['version'], ()=>{
  gulp.src(js_files, { base: './' })
      .pipe(babel({presets: ['es2015']}))
      .pipe(uglify())
      .pipe(gulp.dest('build/uglified'))

  return gulp.src('index.html', { base: './' })
      .pipe(htmlmin({collapseWhitespace: true}))
      .pipe(gulp.dest('build/uglified'))
})

gulp.task('pack', ['uglify'], ()=>{
  console.log("Copying app files")
  for(file in app_files){
    console.log(`** File: ${app_files[file]}`)
    fs.copySync(app_files[file], `build/src/${app_files[file]}`, {overwrite: true})
  }
  console.log("Copying libraries")
  fs.copySync("node_modules", "build/src/node_modules", {overwrite: false})
  console.log("Merging with uglified files")
  fs.copySync('build/uglified', 'build/src', {overwrite: true})

  ASAR_file = 'build/bin/app.asar'
  asar.createPackage('build/src', ASAR_file, ()=>{
    console.log("Package created")
    console.log("Distributing package")
    fs.copy(ASAR_file, "dist/win32-ia32/resources/app.asar", {overwrite: true}, (err)=>{
      if(err){
        console.error(`[Error] ${err}`)
        return
      }
      console.log("win32-ia32: branch built")
    })
    fs.copy(ASAR_file, "dist/win32-x64/resources/app.asar", {overwrite: true}, (err)=>{
      if(err){
        console.error(`[Error] ${err}`)
        return
      }
      console.log("win32-x64: branch built")
    })
    fs.copy(ASAR_file, "dist/linux-x64/resources/app.asar", {overwrite: true}, (err)=>{
      if(err){
        console.error(`[Error] ${err}`)
        return
      }
      console.log("linux-x64: branch built")
    })
    fs.copy(ASAR_file, "dist/darwin-x64/Electron.app/Contents/Resources/app.asar", {overwrite: true}, (err)=>{
      if(err){
        console.error(`[Error] ${err}`)
        return
      }
      console.log("darwin-x64: branch built")
    })
  })
})

gulp.task('clean', ()=>{
  return gulp.src(['build/**'], { read: false })
    .pipe(rm())
})

gulp.task('build', ['pack'])

gulp.task('default', ()=>{
  console.log('Usage:')
  console.log('gulp build - Building and packing to ./dist')
})
