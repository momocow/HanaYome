import * as electron from 'electron'
import * as channels from '../../channels'

import * as globals from '../globals'

export function init(){
  electron.ipcRenderer.on(channels.RendererRequire.request, function(e, rid, requirement){
    globals.LOGGER.info(`Requirement id=${rid} is requiring ${requirement}`)
    electron.ipcRenderer.send(channels.RendererRequire.result, rid, require(requirement))
  })
}
