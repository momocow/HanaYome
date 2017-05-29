process.on ('uncaughtException', (e) => {
  console.error(e.stack)
  process.exit(1)
})

const {app, shell,  BrowserWindow, ipcMain, webContents, clipboard} = require("electron")
const path = require("path")
const log4js = require("log4js")
const url = require("url")

global.APP = app.getName()
global.VERSION = app.getVersion()
global.ROOT = __dirname
global.APP_PATH = app.getAppPath()
global.ASSETS_PATH = path.join(APP_PATH, "assets")
global.APPDATA_PATH = app.getPath("appData")
global.config = require("./lib/config")
global.logger = log4js.getLogger(APP)
global.DEBUG_MODE = config.get("hanayome.debug_mode", false)

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

app.setAppUserModelId('me.momocow.hanayome')
if (process.platform === 'win32' && config.get('hanayome.createShortcut', true)) {
  const shortcutPath = APPDATA_PATH + "\\Microsoft\\Windows\\Start Menu\\Programs\\hanayome.lnk"
  const targetPath = app.getPath('exe')
  const argPath = APP_PATH
  const option = {
    target: targetPath,
    args: argPath,
    appUserModelId: 'me.momocow.hanayome',
    description: 'A dedicated browser for the web game, Flower Knight Girls.',
    icon: path.join(APP_PATH, 'app.ico'),
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

require("./lib/flash")
// require("./lib/proxy")

let mainWindow = null

function createMainWindow(){
  logger.info("Creating app window")

  var winWidth = config.get("hanayome.window.width", 992)
  var winHeight = config.get("hanayome.window.height", 768)
  mainWindow = new BrowserWindow({
    width: winWidth,
    height: winHeight,
    minWidth: 992,
    minHeight: 768,
    resizable: true,
    icon: path.join(ROOT, 'app.ico'),
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

  mainWindow.on("close", ()=>{
    var winSize = mainWindow.getSize()
    config.set("hanayome.window.width", Math.max(992, winSize[0]  - 1))
    config.set("hanayome.window.height", Math.max(768, winSize[1] - 1))
    config.set("hanayome.window.isMaximized", mainWindow.isMaximized())
    config.set("hanayome.window.alwaysOnTop", mainWindow.isAlwaysOnTop())
  })

  mainWindow.on("closed", ()=>{
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
  var proxyScheme = config.get("hanayome.proxy.proxyScheme", "http")
  var proxyPort = config.get("hanayome.proxy.proxyPort", "23777")
  mainWindow.webContents.session.setProxy(
    {proxyRules: `file=direct://;${proxyScheme}://127.0.0.1:${proxyPort}`},
    ()=>{
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
