process.on ('uncaughtException', (e) => {
  console.error(e.stack)
  process.exit(1)
})

const {app, shell,  BrowserWindow, ipcMain, webContents, clipboard, dialog} = require("electron")
const path = require("path")

//set up global variables
global.APP = app.getName()
global.VERSION = app.getVersion()
global.ROOT = __dirname
global.APP_PATH = app.getAppPath()
global.EXE_PATH = app.getPath("exe")
global.ASSETS_PATH = path.join(APP_PATH, "assets")
global.APPDATA_PATH = app.getPath("appData")

const fs = require("fs-extra")
const log4js = require("log4js")
const url = require("url")
const config = require("./lib/config")
const utils = require("./lib/utils")

global.logger = log4js.getLogger(APP)
global.configs = require("./lib/init")
global.whitelist = require("./lib/whiltelist")
global.DEBUG_MODE = configs.debug_mode

if(DEBUG_MODE){
  process.env.NODE_ENV="development"
  logger.info("Running under development mode")
  logger.setLevel("DEBUG")
}
else{
  process.env.NODE_ENV="production"
  logger.info("Running under production mode")
  logger.setLevel("ERROR")
}

//create shortcut
app.setAppUserModelId('me.momocow.hanayome')
const shortcutPath = path.join(APPDATA_PATH, "Microsoft", "Windows", "Start Menu", "Programs", "hanayome.lnk")
try{
  const shortcut = shell.readShortcutLink(shortcutPath)
  if(shortcut.appUserModelId != "me.momocow.hanayome"){
    fs.removeSync(shortcutPath)
    throw "Error shortcut link"
  }
}
catch(err){
  if (process.platform === 'win32' && configs.createShortcut){
    const targetPath = app.getPath('exe')
    const argPath = APP_PATH
    var iconPath
    if(path.basename(EXE_PATH, ".exe").toLowerCase() == "hanayome"){
      iconPath = path.join(path.dirname(EXE_PATH), 'app.ico')
    }
    else{
  	   iconPath = path.join(APP_PATH, "app.ico")
    }
    const option = {
      target: targetPath,
      args: argPath,
      appUserModelId: 'me.momocow.hanayome',
      description: 'A dedicated browser for the web game, Flower Knight Girls.',
      icon: iconPath,
      iconIndex: 0
    }
    shell.writeShortcutLink(shortcutPath, option)

    const safeModeShortcutPath = APPDATA_PATH + "\\Microsoft\\Windows\\Start Menu\\Programs\\hanayome (safe mode).lnk"
    const safeModeOption = Object.assign({}, option)
    Object.assign(safeModeOption, {
      description: 'A dedicated browser for the web game, Flower Knight Girls (safe mode)',
      args: `${argPath} --safe`,
      appUserModelId: 'me.momocow.hanayome',
    })
    shell.writeShortcutLink(safeModeShortcutPath, safeModeOption)
  }
}

require("./lib/flash")
// require("./lib/proxy")

let mainWindow = null

function createMainWindow(){
  logger.info("Creating app window")

  var winWidth = configs.window.width
  var winHeight = configs.window.height
  mainWindow = new BrowserWindow({
    width: winWidth,
    height: winHeight,
    minWidth: 1016,
    minHeight: 806,
    resizable: true,
    icon: path.join(ROOT, 'app.ico'),
    title: "はなよめブラウザ",
    show: false,
    webPreferences: {
      plugins: true
    }
  })

  mainWindow.once("ready-to-show", ()=>{
    mainWindow.show()
  })

  // remove the default menu
  mainWindow.setMenu(null)

  if(configs.window.isMaximized){
    mainWindow.maximize()
  }

  mainWindow.on("close", ()=>{
    var winSize = mainWindow.getSize()
    config.set("hanayome.window.width", Math.max(1016, winSize[0]  - 1))
    config.set("hanayome.window.height", Math.max(806, winSize[1] - 1))
    config.set("hanayome.window.isMaximized", mainWindow.isMaximized())
    config.set("hanayome.window.isAlwaysOnTop", mainWindow.isAlwaysOnTop())
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  if(DEBUG_MODE){
    mainWindow.webContents.openDevTools({detach: true})
  }

  mainWindow.webContents.setAudioMuted(config.get("hanayome.audio.isMuted", false))

  mainWindow.webContents.on('will-navigate', (e) => {
    e.preventDefault()
  })

  // proxy client settings
  var proxyScheme = configs.proxy.proxyScheme
  var proxyPort = configs.proxy.proxyPort
  mainWindow.webContents.session.setProxy(
    {proxyRules: `file=direct://;${proxyScheme}://127.0.0.1:${proxyPort}`},
    ()=>{
      logger.info("App window loading")
      mainWindow.loadURL(url.format({
        pathname: path.join(APP_PATH, "index.html"),
        protocol: "file:",
        slashes: true
      }))
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

ipcMain.on("hanayome.main.dom-ready", (e, id)=>{
  var webviewContent = webContents.fromId(id)
  webviewContent.on("will-navigate", (e, url)=>{
    if(!whitelist.hasURL(url)){
      e.preventDefault()
    }
  })

  e.returnValue=null
})

ipcMain.on("hanayome.webview.screenshot.pre", (e, id)=>{
  var webviewContent = webContents.fromId(id)
  try{
    webviewContent.capturePage({x: 0, y: 0, width: 1200, height: 800}, (img)=>{
      try{
        clipboard.writeImage(img)
        e.sender.send("hanayome.webview.screenshot.post", true)
      }
      catch(err){
        e.sender.send("hanayome.webview.screenshot.post", false, err.message)
      }
    })
  }
  catch(err){
    e.sender.send("hanayome.webview.screenshot.post", false, err.message)
  }
})

ipcMain.on("hanayome.version_check", (e)=>{
  require("./lib/version_check").then((new_ver)=>{
    e.returnValue = new_ver
  })
})
