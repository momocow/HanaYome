import * as path from "path"
import * as electron from 'electron'
import * as fs from "fs"

import * as globals from '../globals'

import { appLog } from '../service/logging'

let pluginName, folderName
switch (process.platform) {
  case 'win32':
    pluginName = 'pepflashplayer.dll'
    folderName = `win-${process.arch}`
    break
  case 'linux':
    pluginName = 'libpepflashplayer.so'
    folderName = `linux-${process.arch}`
    break
}

let flashPaths = [
  path.join(globals.ASSETS_PATH, 'PepperFlash', folderName, pluginName)
]

try {
  const path = electron.app.getPath('pepperFlashSystemPlugin')
  flashPaths.unshift(path)
} catch (e) {
  appLog.warn('Cannot get system flash plugin path')
}

for (const flashPath of flashPaths) {
  try {
    fs.accessSync(flashPath, fs.constants.R_OK)
    electron.app.commandLine.appendSwitch('ppapi-flash-path', flashPath)
    appLog.info(`Flash in ${flashPath} is used.`)
    break
  } catch (e) {
    appLog.warn(`Flash in ${flashPath} not found.`)
  }
}
