const {remote, ipcRenderer} = require("electron")
const webview = $('flower-game webview')
const DEBUG_MODE = remote.getGlobal("DEBUG_MODE")

function extractGameView(){
  if(webview.src.toString().includes("http://pc-play.games.dmm.co.jp/play/flower-x")){
    const GAME_SCREEN_CSS = {
      "text-align": "left",
      "position": "fixed",
      "top": "0",
      "left": "0"
    }
    $$("#externalContainer").first().css(GAME_SCREEN_CSS)
  }
}

remote.getCurrentWebContents().on('dom-ready', () => {
  if ($('flower-game').style.display !== 'none')  {
    webview.style.width = "960px"
    webview.style.height = "640px"
    webview.loadURL(GAME_URL)
    webview.addEventListener('dom-ready', ()=>{
      if(DEBUG_MODE){
        webview.openDevTools()
      }
    })
  }
})
