import * as _ from 'lodash'
import * as path from 'path'

import * as globals from '../globals'
import * as ifs from '../util/fs'
import * as config from "../util/config"

function debug(msg: string, ...args: any[]) {
  if (globals.IS_DEBUG_MODE) {
    console.log(msg, ...args)
  }
}

export function getConfig(configName: string, defaultConfigs: any = undefined): config.Config {
  let configFile: string = getConfigFileFromName(configName)
  if (defaultConfigs === undefined) {
    debug('No default configs are provided')
    defaultConfigs = {}
    let maybeItsHere = getDefaultConfigFilesFromName(configName)
    debug(`Candidate default config files: ${maybeItsHere}`)
    for (let candidate of maybeItsHere) {
      try {
        defaultConfigs = ifs.parseObject(candidate)
        debug(`Configuring using ${candidate}`)
        break
      }
      catch (err) {
        debug('Fail to read default config. ', err)
        continue
      }
    }
  }

  return config.Config.getConfig({ configName: configName, configFile: configFile }, defaultConfigs)
}

export function getConfigFileFromName(configName: string): string {
  return path.join(globals.USERDATA_PATH, 'configs', `${configName}-config.cson`)
}

export function getDefaultConfigFilesFromName(configName: string): string[] {
  return [
    path.join(globals.INTERNAL_ASSETS_PATH, 'config', `${configName}-config.default.cson`),
    path.join(globals.INTERNAL_ASSETS_PATH, 'config', `${configName}-config.default.cson`)
  ]
}

/* app config */
export let appConfig: config.Config
try {
  appConfig = getConfig('app')
}
catch (err) {
  console.log(err)
}
