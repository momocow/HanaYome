import * as log4js from 'log4js'


import { App } from '../App'
import * as ebus from '../event/EventBus'
import * as scheduling from '../service/scheduling'

export class PluginBase {
  public run() { }

  public onDomReady() { }

  public onResize(width, height) { }

  protected get app() {
    return App.instance()
  }
  protected get appLog() {
    return log4js.getLogger('mogame.applog')
  }
  protected get gameLog() {
    return log4js.getLogger('mogame.gamelog')
  }
  protected get eventBus() {
    return ebus.EventBus.instance
  }
  protected get schedule() {
    return scheduling.scheduler
  }
}
