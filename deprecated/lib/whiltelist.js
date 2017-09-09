const {app} = require("electron")
const path = require("path")
const CSON = require("cson")
const fs = require("fs-extra")
const log4js = require("log4js")
const logger = log4js.getLogger("Whitelist")

const WLFile = path.join(APPDATA_PATH, app.getName(), "whitelist.cson")
const defaultWLFile = path.join(ASSETS_PATH, "default", "whitelist.cson.default")

class Whitelist{
  constructor(){
    try{
      fs.accessSync(WLFile, fs.R_OK)
      this.list = CSON.parseCSONFile(WLFile)
      logger.info(`Whitelists read from ${WLFile}`)
    }
    catch(e){
      logger.warn(`Fail to read whitelists from ${WLFile}`)
    }

    if(!this.list){
      try{
        fs.copySync(defaultWLFile, WLFile)
        fs.accessSync(WLFile, fs.R_OK)
        this.list = CSON.parseCSONFile(WLFile)
        logger.info(`Using default whitelists read from ${defaultWLFile}`)
      }
      catch(e){
        console.dir(e)
        logger.warn(`Default whitelist file is not found at ${defaultWLFile}`)
      }
    }

    if(!this.list){
      this.list = {URLs: ["https://www.dmm.co.jp/my/-/login", "http://pc-play.games.dmm.co.jp/play/flower-x"]}
      logger.warn("Using hardcore whitelist")
      logger.warn("Allowed URLs: \"https://www.dmm.co.jp/my/-/login\", \"http://pc-play.games.dmm.co.jp/play/flower-x\"")
    }

    this.urls = this.list.URLs

    this.hasURL = (target)=>{
      if(typeof target === "string"){
        for(var i = 0; i < this.urls.length; i++){
          if(target.includes(this.urls[i])){
            return true
          }
        }
        return false
      }
      else{
        throw new TypeError("The first param is expected as a string. ")
      }
    }
  }
}

module.exports = new Whitelist()
