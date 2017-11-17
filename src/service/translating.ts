import * as locale from 'os-locale'
import * as path from 'path'

import * as globals from '../globals'
import * as dict from '../util/Dictionary'

import { appLog } from './logging'
import { appConfig } from './configuring'

let currentLocale: string, currentLangFile: string, currentDict: dict.Dictionary

export function initTranslating(): void {
  appLog.debug('translating#initTranslating()')

  let userLang = appConfig.get('hanayome.lang')
  if (!userLang) {
    userLang = locale.sync()
  }

  use(userLang)
}

export function use(locale: string): void {
  appLog.debug('translating#use()')

  currentLocale = locale
  currentLangFile = path.join(globals.ASSETS_PATH, 'lang', `${locale}.lang.cson`)

  appLog.info(`Using language file: ${currentLangFile}`)

  try {
    currentDict = dict.Dictionary.getDict(currentLocale, currentLangFile)
  } catch (e) {
    appLog.warn(`Lang file for ${locale} is not found.`)
    appLog.warn(e)

    use('zh_TW')
  }
}

export function translate(key: string, namedFormattingArgs?: string | object, ...formattingArgs: any[]): string {
  return (!currentDict) ? key : currentDict.translate(key, namedFormattingArgs, ...formattingArgs)
}
// alias
export const of = translate
