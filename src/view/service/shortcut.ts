import * as channels from '../../channels'
import * as electron from 'electron'
import * as fkg from '../component/fkg-view'

import { windowHandler } from '../../windows/WindowHandler'
import { _$, LOGGER } from '../globals'

export function init() {
  window.$(window).on('keydown', function(e) {
    let FKG_View = <Electron.WebviewTag>_$("FKG > webview")
    if (e.keyCode == 116 && FKG_View) {
      if (e.ctrlKey) { // ctrl + f5
        LOGGER.info('[ctrl+F5] Force reloading and ignore caches')
        FKG_View.reloadIgnoringCache()
      } else if (e.altKey) { // alt + f5
        LOGGER.info('[alt+F5] Reload flash')
        fkg.refreshFlash()
      } else if (!e.metaKey) { // f5
        LOGGER.info('[F5] Normal reload')
        FKG_View.reload()
      }
    }

    if (e.keyCode == 123) { //f12
      LOGGER.info('[F12] Open devTools for the focused window')
      electron.ipcRenderer.send(channels.DevTools.forFocusedWindow)
    }
  })
}
