import * as electron from 'electron'
import * as fs from 'fs'
import * as path from 'path'
import * as uuid from 'uuid'

import * as kit from '../toolkit'

import { PluginBase } from '../PluginBase'

const { PageDomReadyEvent } = kit.events

class Core extends PluginBase {
  private fkgWidth: number
  private fkgHeight: number

  public onDomReady() {
    this.app.getMainWindow().webContents.send(kit.channels.RendererRequire.request,
      uuid(), viewPath('fkg-resizing'))
  }

  public onResize(width, height) {
    let view = this.app.getFKGView()

    this.fkgWidth = 0.94 * width
    this.fkgHeight = 0.87 * height

    if (view) {
      let sizeFactor = Math.min(
        this.fkgWidth / kit.dmm.flashWidth,
        this.fkgHeight / kit.dmm.flashHeight)
      if (sizeFactor > 0) {
        this.app.getMainWindow().webContents.send(
          kit.channels.FKGView.setSize,
          kit.dmm.flashWidth * sizeFactor,
          kit.dmm.flashHeight * sizeFactor
        )
        view.setZoomFactor(sizeFactor)
      }
    }
  }

  public run() {
    // electron.ipcMain.on(kit.channels.FKGView.fetchSize, (e, width, height) => {
    //   this.fkgWidth = width
    //   this.fkgHeight = height
    //   this.appLog.info(`Receive FKG view size: w=${width}, h=${height}`)
    // })

    this.eventBus.on(PageDomReadyEvent, (e) => {
      if (kit.dmm.isFKGPage(e.getURL())) {
        let view = this.app.getFKGView()
        if (view) {
          let alignCSSs = [
            fs.readFileSync(viewPath('dmm.css'), 'utf8'),
            fs.readFileSync(viewPath('dmm-frame.css'), 'utf8')
          ]
          view.send(kit.channels.FKGView.require, uuid(), viewPath('preventDmmAlert'))
          view.send(kit.channels.FKGView.require, uuid(), viewPath('resetScrollOffset'))
          view.insertCSS(alignCSSs[0])
          view.insertCSS(alignCSSs[1])

          let winSize = this.app.getMainWindow().getContentSize()
          this.onResize(winSize[0], winSize[1])
        }
      }
    })
  }
}

function viewPath(...paths){
  return path.join(__dirname, 'view', ...paths)
}

export default new Core()
