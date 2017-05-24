const gulp = require('gulp')
const uglify = require('gulp-uglify')
const babel = require('gulp-babel')
const zip = require('gulp-zip')
const fs = require('fs-extra')
const rm = require('gulp-rimraf')
const ignore = require('gulp-ignore')
const pump = require('pump')
const asar = require('asar')
const htmlmin = require('gulp-html-minifier')
const Q = require('q')

const package_json = require('./package.json')
const package_name = package_json.name
const package_version = package_json.version
const app_files = ['main.js', 'package.json', 'assets/', 'views/', 'models/']
const js_files = ['main.js', 'views/**/*.js', 'models/**/*.js', 'assets/js/**/*.js']

gulp.task('version', ()=>{
  console.log(`*** Start building ${package_name} v${package_version} ***`)
})

gulp.task('uglify-js', ['version'], ()=>{
  return gulp.src(js_files, { base: './' })
      .pipe(babel({presets: ['es2015']}))
      .pipe(uglify())
      .pipe(gulp.dest('build/uglified'))
})

gulp.task('minify-html', ['uglify-js'], ()=>{
  return gulp.src('index.html', { base: './' })
      .pipe(htmlmin({collapseWhitespace: true}))
      .pipe(gulp.dest('build/uglified'))
})

gulp.task('pack', ['minify-html'], async ()=>{
  console.log("Copying app files")
  for(file in app_files){
    console.log(`** File: ${app_files[file]}`)
    fs.copySync(app_files[file], `build/src/${app_files[file]}`, {overwrite: true})
  }
  console.log("Merging with uglified files")
  fs.copySync('build/uglified', 'build/src', {overwrite: true})

  console.log("Building libraries")
  const execSync = require('child_process').execSync;
  const child = execSync('npm install --production', {cwd: "build/src"});

  var deferred = Q.defer()
  ASAR_file = 'build/bin/app.asar'
  asar.createPackage('build/src', ASAR_file, ()=>{
    console.log("Package created")
    console.log("Distributing package")
    fs.copySync(ASAR_file, "dist/win32-ia32/resources/app.asar", {overwrite: true})
    console.log("win32-ia32: branch built")
    fs.copySync(ASAR_file, "dist/win32-x64/resources/app.asar", {overwrite: true})
    console.log("win32-x64: branch built")
    fs.copySync(ASAR_file, "dist/linux-x64/resources/app.asar", {overwrite: true})
    console.log("linux-x64: branch built")
    fs.copySync(ASAR_file, "dist/darwin-x64/Electron.app/Contents/Resources/app.asar", {overwrite: true})
    console.log("darwin-x64: branch built")

    deferred.resolve()
  })

  return deferred.promise
})

gulp.task('build-clean', ['build'], ()=>{
  return gulp.src(['build/*'], { read: false })
    .pipe(rm())
})

gulp.task('build', ['zip'])

gulp.task('zip', ['zip-win-x64', 'zip-win-x86', 'zip-linux-x64', 'zip-mac-x64'])

gulp.task('zip-win-x64', ['pack'], ()=>{
  return gulp.src("dist/win32-x64/**")
    .pipe(zip(`${package_name}-v${package_version}-win-x64.zip`))
    .pipe(gulp.dest("dist/zip"))
})

gulp.task('zip-win-x86', ['pack'], ()=>{
  return gulp.src("dist/win32-ia32/**")
    .pipe(zip(`${package_name}-v${package_version}-win-x32.zip`))
    .pipe(gulp.dest("dist/zip"))
})

gulp.task('zip-linux-x64', ['pack'], ()=>{
  return gulp.src("dist/linux-x64/**")
    .pipe(zip(`${package_name}-v${package_version}-linux-x64.zip`))
    .pipe(gulp.dest("dist/zip"))
})

gulp.task('zip-mac-x64', ['pack'], ()=>{
  return gulp.src("dist/darwin-x64/**")
    .pipe(zip(`${package_name}-v${package_version}-mac-x64.zip`))
    .pipe(gulp.dest("dist/zip"))
})

gulp.task('default', ()=>{
  console.log('Usage:')
  console.log('gulp build - Building and packing to ./dist')
})
