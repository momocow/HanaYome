const {app} = require('electron')
const path = require("path")
const _ = require("lodash")

//set up global variables
global.APP_NAME = app.getName()
global.VERSION = app.getVersion()
global.EXE_PATH = app.getPath("exe")
global.APP_PATH = app.getAppPath()
global.ASSETS_PATH = (path.basename(EXE_PATH, ".exe") == "electron")?
  path.join(APP_PATH, 'src', 'assets'):
  path.join(APP_PATH, 'assets')
global.USERDATA_PATH = app.getPath("userData")
global.DEBUG_MODE = (_.indexOf(process.argv, "-d") >= 0) || (_.indexOf(process.argv, "--debug") >= 0)
