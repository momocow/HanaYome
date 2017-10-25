import { ipcRenderer } from 'electron'

import * as channels from '../../channels'

export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

export class ViewLogger {
  private level: number

  constructor(level: LogLevel) {
    this.level = (ViewLogger.levelMap[level]) ? ViewLogger.levelMap[level] : 40
  }
  public debug(msg: string, ...args: any[]) {
    this.log('debug', msg, ...args)
  }
  public info(msg: string, ...args: any[]) {
    this.log('info', msg, ...args)
  }
  public warn(msg: string, ...args: any[]) {
    this.log('warn', msg, ...args)
  }
  public error(msg: string, ...args: any[]) {
    this.log('error', msg, ...args)
  }
  public setLevel(newLevel: LogLevel) {
    this.level = (ViewLogger.levelMap[newLevel]) ? ViewLogger.levelMap[newLevel] : this.level
  }
  public log(level: LogLevel, msg: string, ...args: any[]) {
    setTimeout(() => {
      if (ViewLogger.levelMap[level] && ViewLogger.levelMap[level] >= this.level) {
        console.log(msg, ...args)
      }
      ipcRenderer.send(channels.RendererLog.logging, level, msg, ...args)
    }, 0)
  }

  public static readonly levelMap: { [level: string]: number } = {
    'debug': 10,
    'info': 20,
    'warn': 30,
    'error': 40
  }
}
