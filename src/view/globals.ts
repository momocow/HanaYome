import * as electron from 'electron'
import * as Promise from 'bluebird'

import * as logging from './service/logging'
import * as config from '../util/config'
import { _$ } from '../util/dom'

export const IS_DEBUG_MODE = <boolean>electron.remote.getGlobal('IS_DEBUG_MODE')
export const LOGGER: logging.ViewLogger = new logging.ViewLogger((IS_DEBUG_MODE) ? 'debug' : 'error')
export const I18N = <(msg: string, ...formats: any[]) => string>electron.remote.getGlobal('i18n')
export const getConfig = <(configName: string) => config.Config>electron.remote.getGlobal('getConfig')
export const appConfig = getConfig('app')
export { _$ }
