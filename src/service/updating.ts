/**
 * @see https://github.com/iffy/electron-updater-example
 */
import * as bluebird from 'bluebird'
import * as electron from 'electron'
import * as semver from 'semver'
import * as bytes from 'bytes-extra'
import * as path from 'path'
import * as notify from 'node-notifier'
import * as util from 'util'

import * as globals from '../globals'

import { autoUpdater } from 'electron-updater'

import { appLog } from './logging'
import { translate } from './translating'
import { appConfig } from './configuring'

let updaterWin: Electron.BrowserWindow = null
let updateToken

function sendStatusToWindow(text) {
  appLog.debug('updating#sendStatusToWindow()')

  appLog.info(text)
  updaterWin.webContents.send('message', text)
}

function createUpdaterWindow() {
  updaterWin = new electron.BrowserWindow({
    frame: false,
    width: 540,
    height: 450
  })

  if (globals.IS_DEBUG_MODE) {
    updaterWin.webContents.openDevTools()
  }

  updaterWin.on('closed', () => {
    updaterWin = null
  })
}


/**
 * Skip update under non-run-as-bin mode
 * If the returned promise is resolved, no update is performed and the app should continue.
 */
export function update(): bluebird<void> {
  return (globals.RUN_AS_PACKAGE || !appConfig.get('hanayome.update.check')) ?
    bluebird.resolve() : new bluebird.Promise(_simpleUpdate)
}


/**
 * Check update and show the dialog, if users wanna update, bring them to the download page
 */
function _simpleUpdate(resolve, reject) {
  autoUpdater.autoDownload = false

  autoUpdater.once('update-not-available', function() {
    appLog.info('An update is not available.')
    resolve()
  })
  autoUpdater.once('update-available', (info) => {
    appLog.info('An update is available.')
    appLog.info(util.inspect(info))

    const updateBoxOption: Electron.MessageBoxOptions = {
      type: 'question',
      buttons: [translate("btnGoToDownload") + "(&v)", translate("btnCancel") + "(&c)"],
      defaultId: 0,
      title: translate("titleUpdateAvailable"),
      message: translate("titleUpdateAvailable"),
      detail: translate("bodyUpdateAvailable", { current: globals.APP_VERSION, latest: info.version }),
      cancelId: 1,
      normalizeAccessKeys: true,
      icon: electron.nativeImage.createFromPath(globals.ICON_ICO),
      checkboxLabel: translate("labelEnableUpdateCheck"),
      checkboxChecked: appConfig.get('hanayome.update.check')
    }

    electron.dialog.showMessageBox(updateBoxOption, function(resp, checked) {
      appConfig.set('hanayome.update.check', checked)
      if (resp == 0) {
        let packageJson = require(path.join(globals.APP_PATH, 'package.json')),
          releaseURL = packageJson.repository.url.replace(/^git\+(http.*)\.git$/, '$1/releases/latest')
        electron.shell.openExternal(releaseURL)
        reject('User chooses to update manually')
      }
      else {
        resolve()
      }
    })
  })

  autoUpdater.once('checking-for-update', function() {
    appLog.info('Checking for update')

    let notifier = notify
    /***************************************************************
    * Workaround for Win10 after the Fall creator update
    * @see https://github.com/mikaelbr/node-notifier/issues/208
    */
    if (process.platform === "win32") {
      let WindowsBalloon: any = notify.WindowsBalloon
      notifier = new WindowsBalloon({
        withFallback: false,
        customPath: ""
      })
    }
    /*************************************************************/

    notifier.notify({
      title: `${globals.APP_DISPLAY_NAME} ${translate("titleUpdateCheck")}`,
      message: translate("bodyUpdateCheck"),
      icon: globals.ICON_PNG
    })
  })

  autoUpdater.checkForUpdates().then(
    function(result) { },
    function(reason) {
      let notifier = notify
  /***************************************************************
  * Workaround for Win10 after the Fall creator update
  * @see https://github.com/mikaelbr/node-notifier/issues/208
  */
      if (process.platform === "win32") {
        let WindowsBalloon: any = notify.WindowsBalloon
        notifier = new WindowsBalloon({
          withFallback: false,
          customPath: ""
        })
      }
  /*************************************************************/

      notifier.notify({
        title: `${globals.APP_DISPLAY_NAME} ${translate("titleUpdateError")}`,
        message: translate("bodyUpdateError")
      })
      appLog.warn('Fail to check the update')
      appLog.warn(reason)
      resolve()
    }
  )
}

function _guiUpdate(resolve, reject) {
  appLog.info('The update is arranged.')

  function _resolve() {
    if (updaterWin) {
      updaterWin.close()
    }
    resolve()
  }

  autoUpdater.autoDownload = false

  autoUpdater.once('checking-for-update', () => {
    sendStatusToWindow(translate("checkForUpdate"))
  })
  autoUpdater.once('update-available', (info) => {
    sendStatusToWindow(translate('updateAvailable'))
    updaterWin.webContents.send('setOptsVis', true)
    updaterWin.webContents.send('setUpdateInfo', {
      name: info.releaseName,
      note: info.releaseNotes,
      date: info.releaseDate,
      version: semver.valid(info.version)
    })
  })
  autoUpdater.once('update-not-available', (info) => {
    sendStatusToWindow(translate('updateNotAvailable'))
    _resolve()
  })
  autoUpdater.on('error', (err) => {
    sendStatusToWindow(translate('updaterError', { message: err.message }))
    appLog.error(err)
    _resolve()
  })
  autoUpdater.on('download-progress', (progressObj) => {
    sendStatusToWindow(translate('downloading', {
      rest: Math.round(progressObj.total / progressObj.bytesPerSecond),
      total: bytes(progressObj.total)
    }))
    updaterWin.webContents.send('download-progress', Math.round(progressObj.percent))
  })
  autoUpdater.once('update-downloaded', (info) => {
    sendStatusToWindow(translate('updateDownloaded'))
    setTimeout(function() {
      autoUpdater.quitAndInstall()
    }, 3000)
  })

  electron.ipcMain.once('action', function(e, shouldUpdate) {
    updaterWin.webContents.send('setOptsVis', false)

    if (shouldUpdate && updateToken) {
      autoUpdater.downloadUpdate(updateToken)
    }
    else { //the user rejects to update
      _resolve()
    }
  })

  createUpdaterWindow()

  updaterWin.webContents.once('dom-ready', function() {
    autoUpdater.checkForUpdates().then(
      function(result) {
        updateToken = result.cancellationToken
      },
      function(reason) {
        appLog.warn('Fail to check the update')
        appLog.warn(reason)
        _resolve()
      }
    )
  })

  updaterWin.loadURL(`file://${globals.VIEW_PATH}/updating.html#v${electron.app.getVersion()}`)
}
