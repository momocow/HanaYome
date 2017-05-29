window.$ = (param) => document.querySelector(param)
window.$$ = window.jQuery = require("jquery")
window.GAME_URL = "http://pc-play.games.dmm.co.jp/play/flower-x/"
window.images = {}
window.toggleableUIs = {}
window.remote = require("electron").remote
window.ipcRenderer = require("electron").ipcRenderer
window.config = remote.getGlobal("config")
window.logger = remote.getGlobal("logger")
window.DEBUG_MODE = remote.getGlobal("DEBUG_MODE")
window.ROOT = remote.getGlobal("ROOT")
