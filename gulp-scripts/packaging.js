const packager = require('electron-packager')
const promise = require('bluebird')

const options = {
  dir: "./build/src",
  all: true,
  appCopyright: "Copyright (c) 2017 牛牛/MomoCow",
  asar: true,
  icon: "./assets/icon/app-icon",
  out: "./dist",
  overwrite: true,
  tmpdir: "./build"
}

function pack(cb){
  packager(options, function(err, app_paths){
    if(err){
      console.error("Fails to package the executables.")
      console.error(err)
      cb(err, undefined)
    }

    cb(undefined, app_paths)
  })
}

module.exports = promise.promisify(pack)
