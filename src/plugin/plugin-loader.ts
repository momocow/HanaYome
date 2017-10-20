import * as path from 'path'
import * as _ from 'lodash'
import { inspect } from 'util'

import * as ifs from '../util/fs'

import { EventBus } from '../event/EventBus'
import { PluginBase } from './PluginBase'
import { appLog } from '../service/logging'

// class FakePlugin implements IPlugin {
//   run() { }
// }

function isActivePlugin(source: string) {
  return getPluginNameFromPath(source).substr(0, 1) != '#'
}

function isValidPlugin(plugin: any) {
  appLog.debug('plugin-loader#isValidPlugin()')

  // let validPluginEntries = _.keys(FakePlugin.prototype)
  // let pluginEntries = _.keys(Object.getPrototypeOf(plugin))
  //
  // _.intersection(validPluginEntries, pluginEntries).length === validPluginEntries.length

  try{
    return plugin instanceof PluginBase
  }
  catch(err){
    return false
  }
}

export function load(): { [pluginName: string]: PluginBase } {
  appLog.debug('plugin-loader#load()')
  const loadedPluginMap: { [pluginName: string]: PluginBase } = {}

  for (let plugin of ifs.getDirs(__dirname).filter(isActivePlugin)) {
    appLog.info(`Loading plugin from '${plugin}'`)
    try {
      let tmpPlugin = require(plugin).default
      if (isValidPlugin(tmpPlugin)) {
        appLog.info(`This plugin is valid`)
        let validPlugin: PluginBase = <PluginBase>tmpPlugin, pluginName: string

        try {
          pluginName = getPluginNameFromPackage(plugin)
        }
        catch (err) {
          appLog.warn(err)
          appLog.warn(`Can't read name property of the plugin from'${plugin}'.\nUse its default name (the directory name of the plugin) instead.`)

          pluginName = getPluginNameFromPath(plugin)
        }

        loadedPluginMap[pluginName] = validPlugin

        setImmediate(function() {
          try {
            validPlugin.run()
          }
          catch (err) {
            appLog.warn(`An exception is thrown from plugin '${pluginName}'`)
            appLog.warn(err)
          }
        })
      }
      else {
        appLog.info(`This plugin is invalid`)
      }
    }
    catch (err) {
      appLog.warn(err)
      appLog.warn(`Fail to load the plugin from'${plugin}'. Skip it.`)
    }
  }

  return loadedPluginMap
}

function getPluginNameFromPath(source: string): string {
  return path.basename(source)
}

function getPluginNameFromPackage(plugin: string): string {
  let pluginInfo = path.join(plugin, 'package.json'), pluginName: string = require(pluginInfo).name

  if (!pluginName) {
    throw 'No package name is found.'
  }

  return pluginName
}
