import * as util from 'util'

import * as error from './exception'
import * as ifs from './fs'
import * as globals from '../globals'

export class Dictionary {
  private lang: string
  private langFile: string
  private langData: object = {}

  /**
   * the langFile should be in CSON format
   */
  private constructor(locale: string, langFile: string) {
    this.lang = locale
    this.langFile = langFile

    this.load()
  }

  /**
   * the langFile should be in CSON format
   */
  public load(): void {
    try {
      this.langData = ifs.loadCSONFile(this.langFile)
    }
    catch (err) {
      error.throwError(err, `An error occurs when reading a language file. ${this.langFile}`)
    }
  }

  /**
   * the langFile should be in CSON format
   */
  public reload(): void {
    this.load()
  }

  public translate(key: string, namedFormatArgs?: object | string, ...formattingArgs: any[]): string {
    if (typeof this.langData[key] === 'string') { //valid entry
      let formatted: string = this.langData[key]
      if (typeof namedFormatArgs === 'object') {
        for (let index in namedFormatArgs) {
          formatted = formatted.replace(new RegExp(`\\\$\\\{${index}\\\}`, 'g'), namedFormatArgs[index])
        }
      }
      else if (typeof namedFormatArgs === 'string') {
        formattingArgs = [namedFormatArgs, ...formattingArgs]
      }

      return util.format(formatted, ...formattingArgs)
    }
    else {
      if (this.langData[key]) {
        delete this.langData[key]
      }

      return key
    }
  }

  private static cachedDicts: { [locale: string]: Dictionary } = {}

  public static getDict(locale: string, langFile: string): Dictionary {
    if (!Dictionary.cachedDicts[locale]) {
      Dictionary.cachedDicts[locale] = new Dictionary(locale, langFile)
    }

    return Dictionary.cachedDicts[locale]
  }
}
