const path = require("path")
const {app} = require("electron")
const fs = require("fs-extra")

let pluginName, folderName
switch (process.platform) {
  case 'win32':
    pluginName = 'pepflashplayer.dll'
    folderName = `win-${process.arch}`
    break
  case 'darwin':
    pluginName = 'PepperFlashPlayer.plugin'
    folderName = `mac-${process.arch}`
    break
  case 'linux':
    pluginName = 'libpepflashplayer.so'
    folderName = `linux-${process.arch}`
    break
}
var ROOT = path.join(APP_PATH, "..")
const flashPaths = [
  path.join(ROOT, '..', 'PepperFlash', folderName, pluginName),
  path.join(ROOT, 'PepperFlash', folderName, pluginName),
]

try {
  const path = app.getPath('pepperFlashSystemPlugin')
  flashPaths.unshift(path)
} catch (e) {
  logger.warn('Cannot get system flash plugin path')
}

for (const flashPath of flashPaths) {
  try {
    fs.accessSync(flashPath, fs.R_OK)
    app.commandLine.appendSwitch('ppapi-flash-path', flashPath)
    logger.info(`Flash in ${flashPath} is used.`)
    break
  } catch (e) {
    logger.warn(`Flash in ${flashPath} not found.`)
  }
}
