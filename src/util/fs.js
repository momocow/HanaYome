const fs = require("fs-extra")
const CSON = require("cson")

function ensureCsonFile(filename){
  fs.ensureFileSync(filename)
  fs.accessSync(filename, fs.R_OK|fs.W_OK)
  return CSON.parseCSONFile(filename)
}

function writeCsonFile(filename, obj){
  fs.writeFileSync(filename, CSON.stringify(obj, null, 2))
}
