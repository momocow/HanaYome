import * as electron from 'electron'

import * as kit from '../../view-kit'

electron.ipcRenderer.on(kit.channels.FKGView.setSize, function(e, w, h){
  kit.LOGGER.info(`Set FKGView to size [${w}px, ${h}px]`)
  if(window.jQuery){
    window.jQuery('FKG').width(w).height(h)
  }
})
