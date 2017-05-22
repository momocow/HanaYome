const path = require('path')
const {app} = require('electron')

global.APP = app.getName()
global.VERSION = app.getVersion()
global.ASSETS_PATH = path.join(app.getAppPath(), "assets")
global.APP_PATH = app.getAppPath()
global.APPDATA_PATH = app.getPath("appData")
