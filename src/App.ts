import * as path from 'path'
import * as electron from 'electron'
import * as fs from 'fs-extra'
import * as _ from 'lodash'
import * as log4js from 'log4js'
import * as URL from 'url'

import * as globals from './globals'
import * as ipc from './ipc/IPCHandler'
import * as pLoader from './plugin/plugin-loader'
import * as utils from './util/misc'

import { PluginBase } from './plugin/PluginBase'
import { appConfig } from './service/configuring'
import { appLog, viewLog } from './service/logging'
import { scheduler } from './service/scheduling'
import { update } from './service/updating'
import { windowHandler } from './windows/WindowHandler'

// commonjs
import winStateManager = require('electron-window-state')

export class App {
  private isActive: boolean = false
  private mainWindow: Electron.BrowserWindow = null
  private FKGView: Electron.WebContents
  private winState = null

  private readonly pluginMap: { [pluginName: string]: PluginBase } = {}

  /**
   * Singleton: Use #instance() to get the instance
   */
  private constructor() {
    appLog.debug('App#constructor()')

    appLog.info(`Creating layout directory at ${globals.LAYOUT_PATH}`)
    fs.ensureDirSync(globals.LAYOUT_PATH)

    let screenshotPath = path.resolve(
      globals.USERDATA_PATH,
      appConfig.get('hanayome.screenshot.path')
    )
    appLog.info(`Creating screenshot directory at ${screenshotPath}`)
    fs.ensureDirSync(screenshotPath)

    this.pluginMap = pLoader.load()

    appLog.info('Start update check')
    electron.app.on('ready', () => {
      update().then(() => { //wont have an update
          appLog.info('Will not have an update. The app continues.')

          this.start()
        })
        .catch((reason) => {
          appLog.warn(reason)
          appLog.warn('Promise from #update() is rejected. Stop the app...')
          this.stop()
        })
    })
  }

  private start() {
    appLog.debug('App#start()')
    appLog.info('Starting the app')

    this.isActive = true

    this.onReady()

    electron.app.on('window-all-closed', utils.ensureThis(this, this.onWindowAllClosed))
    electron.app.on('activate', utils.ensureThis(this, this.ensureMainWindow))

    ipc.main.initChannels(this)

    scheduler.start()
  }

  public setFKGView(vid: number) {
    appLog.debug('App#setFKGView()')

    if (!this.FKGView || this.FKGView.id != vid) {
      try {
        this.FKGView = electron.webContents.fromId(vid)
      }
      catch (err) { }
    }
  }

  public getFKGView() {
    appLog.debug('App#getFKGView()')
    return this.FKGView
  }

  private stop() {
    appLog.debug('App#stop()')
    this.isActive = false
    electron.app.quit()
  }

  private onWindowAllClosed() {
    appLog.debug('App#onWindowAllClosed()')
    this.stop()
  }

  private onReady(): void {
    appLog.debug('App#onReady()')

    if (!electron.app.isReady()) return

    this.winState = this.winState || winStateManager({
      defaultWidth: 1000,
      defaultHeight: 600,
      path: globals.LAYOUT_PATH
    })

    let defaultState = {
      isMaximized: false,
      isFullScreen: false
    }
    this.winState = _.assign(defaultState, this.winState)

    this.ensureMainWindow()
  }

  private onWillNavigate(event, target): void {
    appLog.debug('App#onWillNavigate')
    appLog.warn(`The app window is trying to navigate to ${target} but is stopped.`)

    event.preventDefault()
  }

  private onClosed() {
    this.winState.saveState(this.mainWindow)
    windowHandler.unregister('app')
    this.mainWindow = null
  }

  public ensureMainWindow(): void {
    appLog.debug('App#ensureMainWindow()')

    if (!electron.app.isReady() || this.mainWindow) return

    appLog.info('Creating the window with the following state: ', JSON.stringify(this.winState, null, 2))

    this.mainWindow = new electron.BrowserWindow({
      width: this.winState.width,
      height: this.winState.height,
      resizable: true,
      icon: globals.ICON_PATH,
      title: `${globals.APP_DISPLAY_NAME} v${globals.APP_VERSION}`,
      webPreferences: {
        webSecurity: false,
        plugins: true
      }
    })

    windowHandler.register('app', this.mainWindow)

    // remove the default menu
    this.mainWindow.setMenu(null)

    appLog.info(`[isMaximized]=${this.winState.isMaximized}`)
    if (this.winState.isMaximized) {
      this.mainWindow.maximize()
    }

    appLog.info(`[isFullScreen]=${this.winState.isFullScreen}`)
    this.mainWindow.setFullScreen(this.winState.isFullScreen || false)

    this.mainWindow.on('closed', utils.ensureThis(this, this.onClosed))
    this.winState.manage(this.mainWindow)

    this.mainWindow.webContents.on('will-navigate', utils.ensureThis(this, this.onWillNavigate))
    if (globals.IS_DEBUG_MODE) {
      this.mainWindow.webContents.openDevTools({ mode: "undocked" })
    }

    this.mainWindow.on('resize', () => {
      let winSize = this.mainWindow.getContentSize()
      for (let plugin of _.values(this.pluginMap)) {
        plugin.onResize(winSize[0], winSize[1])
      }
    })

    this.mainWindow.webContents.on('dom-ready', () => {
      setImmediate(() => {
        for (let plugin of _.values(this.pluginMap)) {
          plugin.onDomReady()
        }
      })
    })

    let indexPage = path.join(globals.APP_PATH, 'view', 'index.html')
    appLog.info(`Start loading UIs from ${indexPage}`)
    this.mainWindow.loadURL(URL.format({
      pathname: indexPage,
      protocol: 'file:',
      slashes: true
    }))
  }

  public getWebContents(): Electron.WebContents {
    return (this.mainWindow) ? this.mainWindow.webContents : undefined
  }

  public getMainWindow(): Electron.BrowserWindow {
    return this.mainWindow
  }

  private static appInstance: App = null

  public static instance() {
    appLog.debug('App#instance()')

    if (!App.appInstance) {
      App.appInstance = new App()
    }
    return App.appInstance
  }
}
