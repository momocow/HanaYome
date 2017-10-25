///<reference path='../def/view/view.d.ts'/>

import * as electron from 'electron'

import * as navbar from './component/navbar'
import * as fkg from './component/fkg-view'
import * as jquery from './jquery'
import * as ipc from './service/ipc'

import * as channels from '../channels'

if (!window.jQuery) {
  // load JQuery
  window.jQuery = window.$ = jquery.$
}

electron.remote.getCurrentWebContents().on('dom-ready', ipc.init)
electron.remote.getCurrentWebContents().on('dom-ready', initUIs)
// electron.remote.getCurrentWebContents().on('dom-ready', measureViewSize)

/**
 * init components
 */
function initUIs(): void {
  navbar.init()
  fkg.init()
}

// function measureViewSize(): void {
//   let fkg = globals._$('FKG')
//   electron.ipcRenderer.send(channels.FKGView.fetchSize, fkg.clientWidth, fkg.clientHeight)
// }

// TODO test error object
// electron.remote.getCurrentWebContents().on('did-fail-load', function(...error) {
//     throwViewError(electron.remote.getCurrentWebContents().id, ...error)
// })
//

// function throwViewError(webcontentId: number, ...errorStatus: any[]): void {
//   electron.ipcRenderer.send(channels.RendererEvent.pageFailLoading, webcontentId, ...errorStatus)
// }
