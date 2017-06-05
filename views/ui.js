//lib
const _ = require("lodash")

//alias
const webview = $('flower-game webview')

//init
window.toggleableUIs.volume = ["mute", "volume"]

window.toggleUI = (uiid, cb)=>{
  var imgs = _.get(window.toggleableUIs, uiid, [])

  if(imgs.length != 2){
    cnosole.warn(`No such toggleable UI pair named ${uuid}`)
    return window
  }

  var UIContainer = $(`.ui.ui-${uiid}.toggleable`)
  if(UIContainer.childNodes.length === 1){
    if(UIContainer.childNodes[0] == window.images[imgs[0]]){
      UIContainer.removeChild(window.images[imgs[0]])
      UIContainer.appendChild(window.images[imgs[1]])
      webview.setAudioMuted(false)
    }
    else{
      UIContainer.removeChild(window.images[imgs[1]])
      UIContainer.appendChild(window.images[imgs[0]])
      webview.setAudioMuted(true)
    }
  }

  if(typeof cb != "function"){
    return
  }

  cb()

  return window
}

window.initToggleableUI = (uiid, choice, cb)=>{
  if(typeof choice != "function"){
    choice = ()=> {return true}
  }

  var img_pair = _.get(window.toggleableUIs, uiid, [])

  if(img_pair.length != 2){
    cnosole.warn(`No such toggleable UI pair named ${uuid}`)
    return
  }

  var UIContainer = $(`.ui.ui-${uiid}.toggleable`)
  for(var child of UIContainer.childNodes){
    UIContainer.removeChild(child)
  }

  var chosen = choice()
  if(chosen){
    UIContainer.appendChild(window.images[img_pair[0]])
  }
  else {
    UIContainer.appendChild(window.images[img_pair[1]])
  }

  if(typeof cb != "function"){
    return
  }

  cb(chosen)
}

window.getUIID = (element)=>{
  for(var classname of element.classList){
    var result = classname.match(/ui-(.*)/)
    if(result){
      return result[1]
    }
  }
  return null
}

window.initUIs = ()=>{
  for(var UI of $$(".ui").toArray()){
    if(UI.childNodes.length == 0){
      var uiid = window.getUIID(UI)
      var defaultSpan = document.createElement("SPAN")
      defaultSpan.innerHTML = uiid
      defaultSpan.classList.add("icon")
      var image = _.get(window.images, uiid, defaultSpan)
      UI.appendChild(image)
    }
  }
}

window.initToggleableUIs = ()=>{
  //volume
  window.initToggleableUI(
    "volume",
    ()=>{
      return window.configs.audio.isMuted
    },
    (chosen)=>{
      $$(webview).on("dom-ready", (e)=>{
        webview.setAudioMuted(chosen)
      })
  })
}

window.loadUIIcons = ()=>{
  const glob = require("glob")
  const path = require("path")
  var image_path = path.join(ROOT, "assets", "image", "*.png")
  var imageFiles = glob.sync(image_path)

  for(var imageFile of imageFiles){
    const name = path.basename(imageFile, ".png")
    window.images[name] = document.createElement("IMG")
    window.images[name].classList.add("icon", "img-" + name)
    window.images[name].src = imageFile
  }

  return window
}

window.initInfoModal = ()=>{
  $$("#current_ver").html(VERSION)
}

window.initCtrlTools = ()=>{
  window.initUIs()
  window.initToggleableUIs()
  window.initInfoModal()
}
