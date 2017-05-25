const {remote, ipcRenderer} = require("electron")
const webview = $('flower-game webview')
const DEBUG_MODE = remote.getGlobal("DEBUG_MODE")

remote.getCurrentWebContents().on('dom-ready', () => {
  webview.style.width = "980px"
  webview.style.height = "660px"
  webview.addEventListener('dom-ready', ()=>{
    if(DEBUG_MODE && !webview.isDevToolsOpened()){
      webview.openDevTools()
    }
    //ignore alert from DMM token expiration
    if(webview.src.toString().includes("http://pc-play.games.dmm.co.jp/play/flower-x")){
      webview.executeJavaScript("DMM.netgame.reloadDialog=()=>{}")
    }
  })

  webview.loadURL(GAME_URL)
})
