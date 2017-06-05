//alias
const webview = $('flower-game webview')

//init
window.loadUIIcons()
window.initCtrlTools()

//event listeners
$$(".ui.ui-refresh").on("click", (e)=>{
  webview.reload()
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


//new_vers = [{type: string, version: string}, ...]
new_vers = ipcRenderer.sendSync("hanayome.version_check")
if(new_vers.length > 0){
  //current version is not the latest
  $(".ui.ui-info").appendChild(window.images.attention)
  const tab_attention = window.images.attention.cloneNode(false)
  tab_attention.classList.add("tab-attention")
  $("#tab-vers").appendChild(tab_attention)

  for(var ver of new_vers){
    var ver_container = document.createElement("DIV")
    var ver_title = document.createElement("H4")

    ver_title.innerHTML = ver.version
    if(ver.type){
      var ver_type = document.createElement("SPAN")
      ver_type.classList.add("badge")
      ver_type.innerHTML = ver.type
      ver_title.appendChild(ver_type)
    }
    ver_container.appendChild(ver_title)

    if(ver.changelog){
      var ver_logs = document.createElement("UL")
      for(var log of ver.changelog){
        var ver_change = document.createElement("LI")
        ver_change.innerHTML = `[${log.action}] ${log.desc}`
        ver_logs.appendChild(ver_change)
      }
      ver_container.appendChild(ver_logs)
    }

    $("#new-versions").appendChild(ver_container)
  }
}
