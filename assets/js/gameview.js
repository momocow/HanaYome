const {remote, ipcRenderer} = require("electron")

const logger = remote.getGlobal('logger')
const webContent = remote.getCurrentWebContents()

var isLocationAt = (url)=>{
  return webContent.getURL().includes(url)
}

webContent.insertCSS("body{overflow:hidden;}")

if(isLocationAt("http://pc-play.games.dmm.co.jp/play/flower-x")){
  logger.info("Game launched")

  window.onload = (e)=>{
    const alignCSS = document.createElement('style')
    const alignInnerCSS = document.createElement('style')
    alignCSS.innerHTML =
      `html {
        overflow: hidden;
      }
      #w, #main-ntg {
        position: absolute !important;
        top: 0;
        left: 0;
        z-index: 100;
        margin-left: 0 !important;
        margin-top: 0 !important;
      }
      #game_frame {
        width: 960px !important;
        position: absolute;
        top: 0px;
        left: 0;
      }
      .naviapp {
        z-index: -1;
      }
      #ntg-recommend {
        display: none !important;
      }
      `
    alignInnerCSS.innerHTML = `
      #spacing_top {
        display: none;
      }
      `
    document.querySelector('body').appendChild(alignCSS)
    const iframeDoc = document.querySelector('#game_frame').contentWindow.document
    iframeDoc.querySelector('body').appendChild(alignInnerCSS)

    ipcRenderer.send("game-resize", {width: 960, height: 640})
    // $(iframeDoc).find("#externalContainer").first().css("text-align", 'left')
  }
}
