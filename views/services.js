//alias
const webview = $('flower-game webview')

//init
window.loadUIIcons()
window.initCtrlTools()

//event listeners
$$(".ui.ui-refresh").on("click", (e)=>{
  webview.reload()
})

$$(".ui.ui-info").on("click", (e)=>{
  window.ipcRenderer.send("hanayome.info.open")
})

$$(".ui.ui-volume.toggleable").on("click", (e)=>{
    window.toggleUI("volume", ()=>{
      if($(`.ui.ui-volume.toggleable`).childNodes[0] == window.images.mute){
        webview.setAudioMuted(true)
      }
      else{
        webview.setAudioMuted(false)
      }
    })
})

$$(".ui.ui-screenshot").on("click", (e)=>{
  ipcRenderer.send("hanayome.webview.screenshot.pre", webview.getWebContents().id)
})

ipcRenderer.on("hanayome.webview.screenshot.post", (e, result, err)=>{
  if(result){
    $$.notify("Screenshot Copied!", "success")
  }
  else{
    $$.notify(err.message, "error")
  }
})
