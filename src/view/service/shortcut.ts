import * as fkg from '../component/fkg-view'

import { _$ } from '../globals'

export function init() {
  window.$(window).on('keydown', function(e) {
    let FKG_View = <Electron.WebviewTag>_$("FKG > webview")
    if (FKG_View) {
      if (e.keyCode == 116) {
        if (e.ctrlKey) { // ctrl + f5
          FKG_View.reloadIgnoringCache()
        } else if (e.altKey) { // alt + f5
          fkg.refreshFlash()
        } else if (!e.metaKey) { // f5
          FKG_View.reload()
        }
      }
    }
  })
}
