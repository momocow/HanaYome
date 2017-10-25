import { ipcRenderer } from 'electron'
import * as channels from '../../channels'

import * as globals from '../globals'

ipcRenderer.on(channels.FKGView.require, function(e, rid, requirement) {
  globals.LOGGER.info(`Requirement id=${rid} is requiring ${requirement}`)
  ipcRenderer.send(channels.FKGView.requireResult, rid, require(requirement))
})
