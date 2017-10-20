import * as format from 'dateformat'
import * as fs from 'fs-extra'
import * as _ from 'lodash'
import * as log4js from 'log4js'
import * as path from 'path'
import * as dir from 'node-dir'

import * as globals from '../globals'
import * as constants from '../util/contants'

export const LOGS_DIR = path.join(globals.USERDATA_PATH, "logs")

export var appLog: log4js.Logger = log4js.getLogger()
export const appLogPath: string = path.join(LOGS_DIR, "app.log")

export var gameLog: log4js.Logger = log4js.getLogger()
export const gameLogPath: string = path.join(LOGS_DIR, "game.log")

export var viewLog: log4js.Logger = log4js.getLogger()
export const viewLogPath: string = path.join(LOGS_DIR, "view.log")

let isInitialized: boolean = false
export function initLogging(daysToKeep: number, compress: boolean): void {
  //init
  const logConfig: log4js.Configuration = {
    appenders: {
      'gamelog': {
        type: 'dateFile',
        filename: gameLogPath,
        pattern: '-yyyy-MM-dd.log',
        compress: compress,
        daysToKeep: daysToKeep,
        alwaysIncludePattern: false,
        layout: {
          type: 'pattern',
          pattern: "[%d{ISO8601_WITH_TZ_OFFSET}] [%c] [%5.5p] %m"
        }
      },
      'applog': {
        type: 'dateFile',
        filename: appLogPath,
        pattern: '-yyyy-MM-dd.log',
        compress: compress,
        daysToKeep: daysToKeep,
        alwaysIncludePattern: false,
        layout: {
          type: 'pattern',
          pattern: "[%d{ISO8601_WITH_TZ_OFFSET}] [%c] [%5.5p] %m"
        }
      },
      'viewlog': {
        type: 'dateFile',
        filename: viewLogPath,
        pattern: '-yyyy-MM-dd.log',
        compress: compress,
        daysToKeep: daysToKeep,
        alwaysIncludePattern: false,
        layout: {
          type: 'pattern',
          pattern: "[%d{ISO8601_WITH_TZ_OFFSET}] [%c] [%5.5p] %m"
        }
      },
      'console': {
        type: 'console',
        layout: {
          type: 'pattern',
          pattern: "[%d{ISO8601_WITH_TZ_OFFSET}] [%c] [%5.5p] %m"
        }
      }
    },
    categories: {
      'mogame.gamelog': {
        appenders: ['console', 'gamelog'],
        level: 'ALL'
      },
      'mogame.applog': {
        appenders: ['console', 'applog'],
        level: (globals.IS_DEBUG_MODE) ? 'DEBUG' : 'ERROR'
      },
      'mogame.viewlog': {
        appenders: ['console', 'viewlog'],
        level: (globals.IS_DEBUG_MODE) ? 'DEBUG' : 'ERROR'
      },
      'default': {
        appenders: ['console'],
        level: (globals.IS_DEBUG_MODE) ? 'DEBUG' : 'ERROR'
      }
    }
  }

  log4js.configure(logConfig)
  appLog = log4js.getLogger('mogame.applog')
  gameLog = log4js.getLogger('mogame.gamelog')
  viewLog = log4js.getLogger('mogame.viewlog')

  isInitialized = true
}
