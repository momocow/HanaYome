const {ipcRenderer} = require("electron")
const webview = $('flower-game webview')
const $webview = $$('flower-game webview')

remote.getCurrentWebContents().on('dom-ready', () => {
  ipcRenderer.sendSync("hanayome.main.dom-ready", webview.getWebContents().id)

  webview.getWebContents().on('dom-ready', ()=>{
    if(DEBUG_MODE && !webview.isDevToolsOpened()){
      webview.openDevTools({detach: true})
    }
    //ignore alert from DMM token expiration
    if(webview.src.toString().includes("http://pc-play.games.dmm.co.jp/play/flower-x")){
      webview.executeJavaScript("DMM.netgame.reloadDialog=()=>{}")
      webview.setZoomFactor(1.0)
    }
  })
  webview.loadURL(GAME_URL)
})
