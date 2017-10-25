import * as electron from 'electron'
import * as Promise from 'bluebird'

import * as logging from './service/logging'
import { _$ } from '../util/dom'

export const IS_DEBUG_MODE = <boolean>electron.remote.getGlobal('IS_DEBUG_MODE')
export const LOGGER: logging.ViewLogger = new logging.ViewLogger((IS_DEBUG_MODE) ? 'debug' : 'error')
export const I18N = <(msg: string, ...formats: any[]) => string>electron.remote.getGlobal('i18n')
export { _$}
