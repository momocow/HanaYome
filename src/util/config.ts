///<reference path="../../node_modules/typescript/lib/lib.es2017.string.d.ts"/>
import * as _ from 'lodash'
import * as cson from 'cson'
import * as fs from 'fs-extra'
import * as events from 'events'
import * as semver from 'semver'

import * as colle from './collections'
import * as error from './exception'
import * as ifs from './fs'

const configVersionComment =
`
###################################
# DO NOT change this field manually
###################################
$##################
###################################
`

export interface IConfigData {
  cversion: string,
  [key: string]: string
}

/**
 * 4 events:
 *   - config.ready
 *   - config.changed
 *   - config.saved
 *   - config.loaded
 */
export class Config extends events.EventEmitter {
  private readonly configName: string
  private readonly configFile: string
  private readonly defaultConfigData: IConfigData
  private configData: IConfigData = { cversion: "0.0.0" }

  private constructor(configName: string, configFilePath: string, defaultConfig: IConfigData = { cversion: "0.0.0" }) {
    super()

    if (!configFilePath || !configName) {
      throw new Error('Config initialization error.')
    }

    if (defaultConfig === undefined) {
      defaultConfig = { cversion: "0.0.0" }
    }

    this.configName = configName
    this.configFile = configFilePath
    this.defaultConfigData = _.cloneDeep(defaultConfig)

    this.setMaxListeners(102)
    this.load()

    let saveToFile = (): void => {
      this.save()
    }

    this.on('config.ready', saveToFile)
    this.on('config.changed', saveToFile)

    this.emit('config.ready', this)
  }

  public get(key: string, defaultValue: any = undefined): any {
    let ret = _.get(this.configData, key, undefined)
    if (!ret && key && (defaultValue !== undefined)) {
      this.set(key, defaultValue)
      ret = defaultValue
    }
    return ret
  }

  public set(key: string, value: any): void {
    if (!key || _.get(this.configData, key, undefined) == value) {
      return
    }
    if (value === undefined) {
      this.delete(key)
      return
    }

    _.set(this.configData, key, value)
    this.emit('config.changed', this)
  }

  public reset(key: string = ''): void {
    if (!key) {
      this.configData = _.cloneDeep(this.defaultConfigData)
    }
    else {
      let defaultValue = _.get(this.defaultConfigData, key, undefined)
      if (defaultValue) {
        _.set(this.configData, key, defaultValue)
      }
      else {
        this.delete(key)
      }
    }
    this.emit('config.changed', this)
  }

  public delete(key: string = ''): void {
    if (!key) {
      this.configData = { cversion: "0.0.0" }
    }
    else {
      if (this.has(key)) {
        _.set(this.configData, key, undefined)

        let reduced = colle.reduceLeaves(this.configData, (src: object, leaf: string): boolean => {
          return this.has(leaf)
        })

        this.configData = _.assign({ cversion: "0.0.0" }, reduced)
      }
    }
    this.emit('config.changed', this)
  }

  public has(key: string): boolean {
    return _.has(this.configData, key)
  }

  public save(): void {
    try{
      let commentedConfigVersion = configVersionComment
        .replace('$', `cversion: "${this.configData.cversion}"`)
        .padEnd(35, '#')
      fs.outputFileSync(this.configFile,
        cson.stringify(this.configData).replace(/cversion[^\n]*/, commentedConfigVersion))
      this.emit('config.saved')
    }
    catch (err) {
      let failureDesc: string = `Config#save(): An error occurs when writing the config file. ${this.configFile}** Original message:\n`
      error.throwError(err, failureDesc)
    }
  }

  public load(): void {
    this.configData = _.cloneDeep(this.defaultConfigData)

    let content: any
    try {
      content = ifs.ensureCSONFile(this.configFile)
      if (!content.cversion || semver.neq(this.configData.cversion, content.cversion)) {
        console.error(`Invalid configs at ${this.configFile}`)
        throw 'Invalid configs'
      }
    }
    catch (err) {
      content = {}
    }

    _.merge(this.configData, content)

    this.emit('config.loaded')
  }

  public reload(): void {
    this.load()
  }

  public getFile(): string {
    return this.configFile
  }

  public getName(): string {
    return this.configName
  }

  public getEntries(): string[][]{
    return colle.getAllPaths(this.configData)
  }

  /**
   * [key]: configName string
   * [value]: configInstance Config
   */
  public static readonly cachedConfigNames: { [configName: string]: Config } = {}
  /**
   * [key]: configFile string
   * [value]: configInstance Config
   */
  public static readonly cachedConfigFiles: { [configFile: string]: Config } = {}

  public static getConfig({ configName, configFile }: ConfigIdentifier, defaultConfigs: IConfigData = { cversion: "0.0.0" }): Config {
    if (!defaultConfigs.cversion) {
      throw new Error('Invalid default configuration. No cversion is provided.')
    }

    if (configName && configFile && !Config.hasConfig({ configName, configFile })) {
      Config.cachedConfigNames[configName] = Config.cachedConfigFiles[configFile] =
        new Config(configName, configFile, defaultConfigs)
    }

    return (configName) ? Config.cachedConfigNames[configName] :
      (configFile) ? Config.cachedConfigFiles[configFile] :
        undefined
  }

  public static hasConfig({ configName, configFile }: ConfigIdentifier): boolean {
    return Boolean(configName && configFile &&
      Config.cachedConfigNames[configName] && Config.cachedConfigFiles[configFile]) ||
      Boolean(configName && Config.cachedConfigNames[configName]) ||
      Boolean(configFile && Config.cachedConfigFiles[configFile])
  }
}

export interface ConfigIdentifier {
  configName?: string
  configFile?: string
}
