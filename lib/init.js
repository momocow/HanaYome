const config = require("./config")

module.exports = {
  debug_mode: config.get("hanayome.debug_mode", false),
  createShortcut: config.get('hanayome.createShortcut', true),
  window:{
    width: config.get("hanayome.window.width", 1016),
    height: config.get("hanayome.window.height", 806),
    isMaximized: config.get("hanayome.window.isMaximized", false),
    isAlwaysOnTop: config.get("hanayome.window.isAlwaysOnTop", false)
  },
  audio:{
    isMuted: config.get("hanayome.audio.isMuted", false)
  },
  proxy:{
    proxyScheme: config.get("hanayome.proxy.proxyScheme", "http"),
    proxyPort: config.get("hanayome.proxy.proxyPort", "23777")
  },
  resource:{
    versions: config.get("hanayome.resource.versions",
      "https://gist.githubusercontent.com/momocow/5c5536f7831c2f979e839a05a5ad4f1c/raw")
  }
}
