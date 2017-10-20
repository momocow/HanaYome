import * as electron from 'electron'
import * as Promise from 'bluebird'

import * as logging from './service/logging'
import { _$ } from '../util/dom'

export const IS_DEBUG_MODE = <boolean>electron.remote.getGlobal('IS_DEBUG_MODE')
export const LOGGER: logging.ViewLogger = new logging.ViewLogger((IS_DEBUG_MODE) ? 'debug' : 'error')
export const I18N = <(msg: string, ...formats: any[]) => string>electron.remote.getGlobal('i18n')
export const $ = require('../../assets/vendor/flat-ui/js/vendor/jquery.min')
export { _$}

/* UIs */
// export interface UIMap{
//   FKG_View: Electron.WebviewTag
// }
//
// class UIMapImpl implements UIMap{
//   public FKG_View: Electron.WebviewTag
//
//   constructor() {
//     this.FKG_View = <Electron.WebviewTag>this.$safe('FKG>webview')
//   }
//
//   private $safe(selector: string, fail_desc: string = `\$(${selector}) is undefined`): Element {
//     let element: Element = _$(selector)
//
//     if (element === undefined) {
//       throw fail_desc
//     }
//
//     return element
//   }
// }
//
// let UI: UIMap = undefined
//
// export const getUIs = function(): Promise<UIMap> {
//   LOGGER.debug('globals#getUIs()')
//   return new Promise(function(resolve, reject) {
//     LOGGER.info('Try to fetch UIs')
//
//     if(UI){ // cache hit
//       LOGGER.info('The cached UI is used')
//       return resolve(UI)
//     }
//
//     try{
//       UI = new UIMapImpl()
//       LOGGER.info('UIs are ready to be accessed')
//       return resolve(UI)
//     }
//     catch(err){
//       LOGGER.info('UIs are not ready, try listening on the dom-ready event instead')
//     }
//
//
//     electron.remote.getCurrentWebContents().on('dom-ready', function() {
//       LOGGER.info('DOM is ready')
//       try{
//         UI = new UIMapImpl()
//         LOGGER.info('UIs are ready to be accessed')
//         return resolve(UI)
//       }
//       catch(err){
//         LOGGER.error('Fail to fetch UIs from DOM')
//         return reject(err)
//       }
//     })
//   })
// }
