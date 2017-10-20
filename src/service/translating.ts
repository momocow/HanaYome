import * as locale from 'os-locale'
import * as path from 'path'

import * as globals from '../globals'
import * as dict from '../util/Dictionary'

import { appLog } from './logging'

let currentLocale: string, currentLangFile: string, currentDict: dict.Dictionary

export function initTranslating(): void {
  appLog.debug('translating#initTranslating()')
  use(locale.sync())
}

export function use(locale: string): void {
  appLog.debug('translating#use()')

  currentLocale = locale
  currentLangFile = path.join(globals.ASSETS_PATH, 'lang', `${locale}.lang.cson`)

  appLog.info(`Using language file: ${currentLangFile}`)
  currentDict = dict.Dictionary.getDict(currentLocale, currentLangFile)
}

export function translate(key: string, namedFormattingArgs?: string | object, ...formattingArgs: any[]): string {
  return (!currentDict) ? key : currentDict.translate(key, namedFormattingArgs, ...formattingArgs)
}
// alias
export const of = translate
