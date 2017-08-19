const fs = require('fs-extra')
const path = require('path')
const _ = require('lodash')
const {range} = require('range')
const isNumeric = require('isnumeric');
const vcmp = require('node-version-compare')

const pack_list = ['./package.json', './src/package.json']

/**
 * @key {string} an absolute path of a package.json
 * @value {object} a loaded object
 */
let cached_packs = {}

/**
 * if there is any inconsistency between versions of packages in pack_list,
 * the latest one is returned
 * @return {String} the latest version
 */
function getVersion(){
  let versions = []
  for(let pkg_path of pack_list){
    try{
      let abs_path = path.resolve(pkg_path)
      cached_packs[abs_path] = require(abs_path)
      versions.push(cached_packs[abs_path].version)
    }
    catch(e){
      console.error(`Fail to read ${pkg_path}`)
      console.error(e)
      continue
    }
  }

  let latest = "0.0.0"
  for(let ver of versions){
    if(vcmp(latest, ver) < 0){
      latest = ver
    }
  }

  return latest
}

/**
 * update all package to the same version
 * @param {String} version
 */
function setVersion(version){
  for(let pkg_path of _.keys(cached_packs)){
    cached_packs[pkg_path].version = version
    fs.writeJsonSync(pkg_path, cached_packs[pkg_path], {spaces: '\t'})
  }
}

function resetCache(){
  cached_packs = {}
}

/**
 * increase the specified version number by 1
 * @param {Number} type 0: major; 1: minor; 2: patch; 4: dev-stage
 */
function tick(type){
  let latest = getVersion()
  let idx_stage = latest.lastIndexOf("-")
  let stage = (idx_stage >= 0)? latest.substr(idx_stage + 1): ''
  let ver_str = (idx_stage >= 0)? latest.substr(0, idx_stage): latest
  let versToken = ver_str.split(".")

  if(!versToken[type] && type < 4){
    for(let i of range(_.size(versToken), type + 1)){
      versToken[i] = '0'
    }
  }
  if(isNumeric(versToken[type])){
    versToken[type] = `${parseInt(versToken[type]) + 1}`
  }

  if(type == 4 && stage == "alpha"){
    stage = "beta"
  }
  else if(type == 4 && stage == "beta"){
    stage = "release"
  }

  let final = versToken.join(".")
  if(stage){
    final += `-${stage}`
  }
  setVersion(final)
  resetCache()
}

function major(){
  tick(0)
}

function minor(){
  tick(1)
}

function patch(){
  tick(2)
}

function stage(){
  tick(4)
}

module.exports = {
  major, minor, patch, stage
}
