import * as electron from 'electron'
import * as path from 'path'
import * as url from 'url'

import * as globals from '../../globals'

import { translate } from '../../service/translating'
import { windowHandler } from '../WindowHandler'

let _windowInstance: Electron.BrowserWindow

export function create() {
  if (!_windowInstance) {
    _windowInstance = new electron.BrowserWindow({
      width: 640,
      height: 500,
      maximizable: false,
      fullscreenable: false,
      resizable: false,
      show: true,
      icon: globals.ICON_PATH,
      title: translate('settingsTitle')
    })

    windowHandler.register('config', _windowInstance)

    _windowInstance.webContents.on('will-navigate', function(e) {
      e.preventDefault()
    })

    _windowInstance.on('closed', function() {
      windowHandler.unregister('config')
      _windowInstance = null
    })

    _windowInstance.setMenu(null)

    if(globals.IS_DEBUG_MODE){
      _windowInstance.webContents.openDevTools({
        mode: "undocked"
      })
    }

    let configHTML = path.join(__dirname, 'config.html')
    _windowInstance.loadURL(url.format({
      protocol: 'file:',
      pathname: configHTML,
      slashes: true
    }))
  }
}
