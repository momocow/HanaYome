///<reference path="./def/package.d.ts"/>

import * as electron from 'electron'
import * as fs from 'fs-extra'
import * as log4js from 'log4js'
import * as path from 'path'

import * as Main from './App'
import * as globals from './globals'
import * as configuring from './service/configuring'
import * as translating from './service/translating'
import * as logging from './service/logging'

let dtk: number = configuring.appConfig.get('hanayome.logs.daysToKeep')
let cpr: boolean = configuring.appConfig.get('hanayome.logs.compress')
logging.initLogging(dtk, cpr)
translating.initTranslating()

/**
 * if electron.app is not ready, the function does nothing.
 * the callback is only called after successfully prompting the dialog
 * @return boolean successfully prompting the dialog or not
 */
function prompErrorMsgDialog(): boolean {
    if (electron.app.isReady()) {
        const btnIssueOnGithub = translating.of('IssueOnGithub') + ' (&i)'
        const btnShowAppLogInExplorer = translating.of('ShowAppLogInExplorer') + ' (&e)'
        const btnViewAppLog = translating.of('ViewAppLog') + ' (&v)'
        const btnFinish = translating.of('Finish') + ' (&f)'
        const errorBoxTitle = translating.of('ErrorBoxTitle')
        const errorBoxMessage = translating.of('ErrorBoxMessage')
        const ErrorBoxDetail = translating.of('ErrorBoxDetail')

        const errorBoxOption: Electron.MessageBoxOptions = {
          type: 'error',
          buttons: [btnIssueOnGithub, btnShowAppLogInExplorer, btnViewAppLog, btnFinish],
          defaultId: 0,
          title: errorBoxTitle,
          message: errorBoxMessage,
          detail: ErrorBoxDetail,
          cancelId: 3,
          normalizeAccessKeys: true
        }

        switch (electron.dialog.showMessageBox(errorBoxOption)) {
            case 0:
                let hanayomeInfo: Package = fs.readJSONSync('./package.json')
                electron.shell.openExternal(hanayomeInfo.bugs.url)
                break
            case 1:
                electron.shell.showItemInFolder(logging.appLogPath)
                break
            case 2:
                electron.shell.openItem(logging.appLogPath)
            default:
        }

        //Don't worry for returning 0, we've handled the error
        electron.app.exit(0)
        return true
    }
    return false
}

process.on('uncaughtException', (err)=>{
  logging.appLog.fatal('An uncaught exception occurs.')
  logging.appLog.fatal(err.toString())

  // flush all logs
  log4js.shutdown(function() {
      if (!prompErrorMsgDialog()) {
          // electron.app is not ready
          electron.app.on('ready', prompErrorMsgDialog)
      }
  })
})

// init flash
import './util/flash'

// register onto global object to share with renderer process
global['i18n'] = translating.translate
global['IS_DEBUG_MODE'] = globals.IS_DEBUG_MODE

let main = Main.App.instance()
