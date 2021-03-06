///<reference path='../def/view/view.d.ts'/>

import * as electron from 'electron'

import * as navbar from './component/navbar'
import * as fkg from './component/fkg-view'
import * as jquery from './jquery'
import * as ipc from './service/ipc'
import * as shortcut from './service/shortcut'

import * as channels from '../channels'

if (!window.jQuery) {
  // load JQuery
  window.jQuery = window.$ = jquery.$
}

electron.remote.getCurrentWebContents().on('dom-ready', ipc.init)
electron.remote.getCurrentWebContents().on('dom-ready', initUIs)
shortcut.init()

/**
 * init components
 */
function initUIs(): void {
  navbar.init()
  fkg.init()
}


// TODO test error object
// electron.remote.getCurrentWebContents().on('did-fail-load', function(...error) {
//     throwViewError(electron.remote.getCurrentWebContents().id, ...error)
// })
//

// function throwViewError(webcontentId: number, ...errorStatus: any[]): void {
//   electron.ipcRenderer.send(channels.RendererEvent.pageFailLoading, webcontentId, ...errorStatus)
// }
