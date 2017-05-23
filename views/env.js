window.$ = (param) => document.querySelector(param)
window.$$ = require("jquery")
window.GAME_URL = "http://pc-play.games.dmm.co.jp/play/flower-x/"

//ignore alert from DMM token expiration
// window.alert = (content)=>{
//   logger.warn(`[Alert] ** ${title} **\n${content}`)
// }
