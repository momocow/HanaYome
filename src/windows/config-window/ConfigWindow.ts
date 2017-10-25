import * as electron from 'electron'
import * as path from 'path'
import * as url from 'url'

import * as globals from '../../globals'

import { translate } from '../../service/translating'

let _windowInstance: Electron.BrowserWindow

export function create() {
  if (!_windowInstance) {
    _windowInstance = new electron.BrowserWindow({
      width: 960,
      height: 640,
      maximizable: false,
      fullscreenable: false,
      resizable: false,
      show: true,
      icon: globals.ICON_PATH,
      title: translate('settingsTitle')
    })

    _windowInstance.webContents.on('will-navigate', function(e){
      e.preventDefault()
    })

    _windowInstance.on('closed', function(){
      _windowInstance = null
    })

    let configHTML = path.join(__dirname, 'config.html')
    _windowInstance.loadURL(url.format({
        protocol: 'file:',
        pathname: configHTML,
        slashes: true
    }))
  }
}
