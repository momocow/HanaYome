import * as electron from 'electron'
import * as uuidv4 from 'uuid/v4'

import * as channels from '../channels'
import * as events from '../event/all'
import * as ebus from '../event/EventBus'
import * as translating from '../service/translating'
import * as ConfigWindow from '../windows/config-window/ConfigWindow'

import { appLog, viewLog } from '../service/logging'
import { App } from '../App'

export namespace main {
  export function initChannels(app: App) {
    electron.ipcMain.once(channels.RendererEvent.pageStopLoading, () => {
      const mainWindow = app.getMainWindow()
      mainWindow.show()
      mainWindow.focus()
    })
      .once(channels.FKGView.fetchID, (e, vid) => {
        app.setFKGView(vid)
      })
      .on(channels.RendererEvent.pageStopLoading, (e, url) => {
        ebus.EventBus.instance.post(new events.PageLoadedEvent(url))
      })
      .on(channels.RendererEvent.pageStartLoading, (e, url) => {
        ebus.EventBus.instance.post(new events.PageStartLoadingEvent(url))
      })
      .on(channels.RendererEvent.pageFailLoading, (e, webcontentId: number, ...error: any[]) => {
        electron.dialog.showErrorBox(
          translating.of('pageFailLoading'),
          translating.of('pageFailLoadingDetails', {
            errorCode: error[1], errorDesc: error[2], url: error[3]
          })
        )
      })
      .on(channels.RendererEvent.pageDomReady, (e, url) => {
        ebus.EventBus.instance.post(new events.PageDomReadyEvent(url))
      })
      .on(channels.RendererLog.logging, (e, level: string, msg: string, ...args: any[]) => {
        if (viewLog[level]) {
          viewLog[level](msg, ...args)
        }
      })
      .on(channels.RendererCall.callFitScrollDim, (e, requiredWidth: number, requiredHeight: number) => {
        appLog.info(`Webview requires \{width=${requiredWidth}, height=${requiredHeight}\}`)

        const mainWindow = app.getMainWindow()

        let currentWinSize = mainWindow.getSize(), finalWidth = currentWinSize[0], finalHeight = currentWinSize[1]
        if (requiredWidth) {
          finalWidth = Math.round(requiredWidth * 100 / 94)
        }
        if (requiredHeight) {
          finalHeight = Math.round(requiredHeight * 100 / 87)
        }

        appLog.info(`Adjust the main window to \{width=${finalWidth}, height=${finalHeight}\}`)
        mainWindow.setSize(finalWidth, finalHeight)
      })
      .on(channels.ConfigWindow.open, (e) => {
        appLog.info('Creating the config window')

        ConfigWindow.create()
      })
  }

}

export namespace Renderer {
  class FKGView {
    private cbMap: { [id: string]: (result: any) => void } = {}

    constructor() {
      electron.ipcMain.on(channels.FKGView.requireResult, (e, id, result) => {
        if (id in this.cbMap) {
          if (this.cbMap[id]) this.cbMap[id](result)
          delete this.cbMap[id]
        }
      })
    }

    public require(theModule: string, cb: (result: any) => void = function() { }) {
      if (!App.instance().getFKGView()) return

      let oneTimeId = uuidv4()
      this.cbMap[oneTimeId] = cb

      App.instance().getFKGView().send(channels.FKGView.require, oneTimeId, theModule)
    }
  }
  export const IPCFKGView = new FKGView()
}
