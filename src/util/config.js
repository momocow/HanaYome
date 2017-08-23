const log4js = require("log4js")
const logger = log4js.getLogger("config")

const {app} = require("electron")
const path = require("path")
const CSON = require("cson")
const fs = require("fs-extra")
const {set, get} = require("lodash")
const {EventEmitter} = require("events")

const ifs = require("../util/fs")

const configFile = path.join(USERDATA_PATH, "config.cson")

class SimpleConfig extends EventEmitter{
  constructor(config_path){
    super()

    this.path = config_path

    try{
      this.configData = ifs.ensureCsonFile(this.path)
    }
    catch(e){
      logger.error(`Fail to read the config file from ${config_path}`)
      logger.error(e)
    }
  }

  function defualt(key, defaultValue){
    let val = this.get(key, undefined)
    if(!val){
      return this.set(key, defaultValue)
    }
    return this
  }

  function get(key, defaultValue){
    return get(this.configData, key, defaultValue)
  }

  function set(key, value){
    if(get(this.configData, key)===value){
      return
    }

    set(this.configData, key, value)
    this.emit("config.set", key, value)

    try{
      ifs.writeCsonFile(this.path, this.configData)
    }
    catch(e){
      logger.error(`Fail to write to the config file at ${this.path}`)
      logger.error(e)
    }

    return this
  }
}

let cfg = new SimpleConfig()
cfg.setMaxListeners(100)

module.exports = cfg
