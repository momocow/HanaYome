import * as electron from 'electron'
import * as fs from 'fs'
import * as path from 'path'

import * as kit from '../toolkit'

import { PluginBase } from '../PluginBase'

const { PageDomReadyEvent } = kit.events


const scriptSetFKGSize = `
require("electron").ipcRenderer.on('${kit.channels.FKGView.setSize}', function(e, w, h){
  jQuery('FKG').width(w).height(h)
})`


class Core extends PluginBase {
  private fkgWidth: number
  private fkgHeight: number

  public onDomReady() {
    this.app.getMainWindow().webContents.executeJavaScript(scriptSetFKGSize)
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
            fs.readFileSync(path.join(__dirname, 'dmm.css'), 'utf8'),
            fs.readFileSync(path.join(__dirname, 'dmm-frame.css'), 'utf8')
          ]
          view.insertCSS(alignCSSs[0])
          view.insertCSS(alignCSSs[1])
          view.executeJavaScript("DMM.netgame.reloadDialog=()=>{}")
          this.appLog.info('Has prevented the DMM reload warning')

          let winSize = this.app.getMainWindow().getContentSize()
          this.onResize(winSize[0], winSize[1])
        }
      }
    })
  }
}

export default new Core()
