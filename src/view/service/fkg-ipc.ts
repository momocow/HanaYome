import { ipcRenderer } from 'electron'
ipcRenderer.on('OGameView.require', function(e, rid, requirement) {
  ipcRenderer.send('OGameView.require.result', rid, require(requirement))
})
