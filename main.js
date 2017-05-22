process.on ('uncaughtException', (e) => {
  console.error(e.stack)
  process.exit(1)
})

const {app, BrowserWindow, ipcMain} = require("electron")
const path = require("path")
const log4js = require("log4js")

global.APP = app.getName()
global.VERSION = app.getVersion()
global.ASSETS_PATH = path.join(app.getAppPath(), "assets")
global.APP_PATH = app.getAppPath()
global.APPDATA_PATH = app.getPath("appData")
global.config = require("./models/config")
global.logger = log4js.getLogger(APP)
global.DEBUG_MODE = config.get("hanayome.debug_mode", false)

if(DEBUG_MODE){
  logger.setLevel("DEBUG")
}
else{
  logger.setLevel("ERROR")
}

require("./models/flash")

let mainWindow = null

function createMainWindow(){
  logger.info("Creating app window")
  mainWindow = new BrowserWindow({
    width: config.get("hanayome.window.width", 980),
    height: config.get("hanayome.window.height", 660),
    useContentSize: true,
    resizable: false,
    title: "はなよめブラウザ",
    webPreferences: {
      plugins: true
    }
  })

  mainWindow.once("ready-to-show", ()=>{
    mainWindow.show()
  })

  // remove the default menu
  mainWindow.setMenu(null);

  if(config.get("hanayome.window.isMaximized", false)){
    mainWindow.maximize()
  }

  var mainPage = path.join(APP_PATH, "index.html")
  mainWindow.loadURL(`file://${mainPage}`)

  mainWindow.on("close", ()=>{
    var winSize = mainWindow.getSize()
    config.set("hanayome.window.width", winSize[0])
    config.set("hanayome.window.height", winSize[1])
    config.set("hanayome.window.isMaximized", mainWindow.isMaximized())
    config.set("hanayome.window.alwaysOnTop", mainWindow.isAlwaysOnTop())
  })

  mainWindow.on("closed", ()=>{
    mainWindow = null
  })

  if(DEBUG_MODE){
    mainWindow.webContents.openDevTools()
  }

  mainWindow.webContents.on('will-navigate', (e) => {
    e.preventDefault()
  })
}

app.on("ready", createMainWindow)

app.on("window-all-closed", ()=>{
  if(process.platform !== "darwin"){
    app.quit()
  }
})

app.on("activate", ()=>{
  if(mainWindow == null){
    createMainWindow()
  }
})

ipcMain.on("game-resize", (event, gameSize)=>{
  logger.debug(`Event 'game-resize' received. width=${gameSize.width}, height=${gameSize.height}`)
  // mainWindow.webContents.executeJavaScript()
  // mainWindow.webContents.executeJavaScript("window.removeListener('resize', window.resizeWebView)")
  logger.info(mainWindow.resizeWebView)
  mainWindow.webContents.insertCSS(`flower-game webview{width:${gameSize.width}px;height:${gameSize.height}px;}`)
})
