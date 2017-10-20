import * as electron from 'electron'
import * as path from 'path'

export const APP_NAME: string = electron.app.getName()
export const APP_DISPLAY_NAME: string = "HanaYome"
export const APP_VERSION: string = electron.app.getVersion()

/**
 * path of prebuilt electron binary or hanayome binary
 */
export const EXE_PATH: string = electron.app.getPath('exe')
/**
 * When run as binary, this is the path of 'app' directory or 'app.asar' file.
 * When run as package, this is '<somewhere>/hanayome/app',
 */
export const APP_PATH: string = electron.app.getAppPath()
export const VIEW_PATH: string = path.join(APP_PATH, 'view')
// only one of RUN_AS_BIN and RUN_AS_PACKAGE should be true, and APP_NAME should not equal to 'electron'
/**
 * (Binary mode) start by hanayome binary
 */
export const RUN_AS_BIN: boolean = path.basename(EXE_PATH, '.exe') === APP_NAME
/**
 * (Package mode) start by prebuilt electron binary
 */
export const RUN_AS_PACKAGE: boolean =
    path.basename(EXE_PATH, '.exe') === 'electron' || !RUN_AS_BIN //compatible even if electron is renamed
/**
 * the path of the 'assets'
 */
export const ASSETS_PATH: string = path.join(APP_PATH, '..', 'assets')
export const INTERNAL_ASSETS_PATH: string = path.join(APP_PATH, 'assets')

export const ICON_ICO: string = path.join(ASSETS_PATH, 'icon', 'app-icon.ico')
export const ICON_PNG: string = path.join(ASSETS_PATH, 'icon', 'app-icon.png')
export const ICON_PATH: string = (process.platform === 'win32')? ICON_ICO: ICON_PNG

export const APPDATA_PATH: string = electron.app.getPath('appData')
export const USERDATA_PATH: string = electron.app.getPath('userData')
export const LAYOUT_PATH: string = path.join(USERDATA_PATH, 'layout')

export const IS_DEBUG_MODE: boolean =
    (process.argv.indexOf('-d') >= 0) || (process.argv.indexOf('--debug') >= 0) ||
    (process.argv.indexOf('--dev') >= 0)

console.log(`[Debug Mode]=${IS_DEBUG_MODE}\n`)
