const log4js = require("log4js")
const logger = log4js.getLogger("Config")

const {app} = require("electron")
const path = require("path")
const CSON = require("cson")
const fs = require("fs-extra")
const {set, get} = require("lodash")
const EventEmitter = require("events")

const configFile = path.join(APPDATA_PATH, app.getName(), "config.cson")
const defaultConfigFile = path.join(ASSETS_PATH, "default", "config.cson.default")

class SimpleConfig extends EventEmitter{
  constructor(){
    super()

    fs.ensureFileSync(configFile)
    try{
      fs.accessSync(configFile, fs.R_OK|fs.W_OK)
      this.configData = CSON.parseCSONFile(configFile)
      logger.info(`Configs read from ${configFile}`)
    }
    catch(e){
      logger.warn(`Fail to read configs from ${configFile}`)
    }

    this.get = (key, defaultValue)=>{
      var value = get(this.configData, key)
      if(value){
        return value
      }
      this.set(key, defaultValue)
      return defaultValue
    }

    this.set = (key, value)=>{
      if(get(this.configData, key)===value){
        return
      }
      set(this.configData, key, value)
      this.emit("config.set", key, value)
      try{
        var cfg = CSON.stringify(this.configData, null, 2)
        fs.writeFileSync(configFile, cfg)
      }
      catch(e){
        logger.error(`Fail to write to config at ${configFile}`)
      }
    }
  }
}

const cfg = new SimpleConfig()
cfg.setMaxListeners(100)

module.exports = cfg
