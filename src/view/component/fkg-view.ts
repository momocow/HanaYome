import * as electron from 'electron'
import * as fs from 'fs'
import * as path from 'path'
import * as url from 'url'
import * as uuid from 'uuid'

import * as globals from '../globals'
import * as channels from '../../channels'
import * as navbar from './navbar'

export function init() {
  globals.LOGGER.debug('fkg-view#init()')

  let FKG_View = <Electron.WebviewTag>globals._$('FKG>webview')

  FKG_View.addEventListener('did-stop-loading', function() {
    electron.ipcRenderer.send(channels.RendererEvent.pageStopLoading, FKG_View.getURL())
  })
  FKG_View.addEventListener('did-start-loading', function() {
    electron.ipcRenderer.send(channels.RendererEvent.pageStartLoading, FKG_View.getURL())
    if(globals.IS_DEBUG_MODE){
      FKG_View.openDevTools()
    }
  })
  FKG_View.addEventListener('dom-ready', function() {
    let wid = FKG_View.getWebContents().id
    globals.LOGGER.info(`FKGView id=${wid}`)
    electron.ipcRenderer.send(channels.FKGView.fetchID, wid)

    electron.ipcRenderer.send(channels.RendererEvent.pageDomReady, FKG_View.getURL())

    let scrollbarCss = fs.readFileSync(path.join(__dirname, 'scrollbar.css'), 'utf8')
    FKG_View.insertCSS(scrollbarCss)

    FKG_View.setAudioMuted(<boolean>globals.appConfig.get('hanayome.audio.isMuted'))
    navbar.update()
  })

  globals.LOGGER.info('Try connecting with DMM')
  FKG_View.loadURL(url.format({
    hostname: 'pc-play.games.dmm.co.jp',
    pathname: 'play/flower-x',
    protocol: 'http:',
    slashes: true
  }))
}

export function refreshFlash(){
  globals.LOGGER.debug('fkg-view#refreshFlash()')
  let FKG_View = <Electron.WebviewTag>globals._$("FKG > webview")

  FKG_View.send(channels.FKGView.require, uuid(),
    path.join(__dirname, '..', 'guest', 'refreshFlash'))
}

// TODO test event object
// views.FKG_View.addEventListener('did-fail-load', function(e) {
//     throwViewError(views.FKG_View.getWebContents().id, {errorCode: errorCode, errorDescription: errorDescription, validatedURL: validatedURL, isMainFrame: isMainFrame})
// })
