import * as ebase from './EventBase'

import { appLog } from '../service/logging'

export class EventBus {
  private readonly eventMap: { [eventType: string]: { (event: ebase.EventBase): void }[] } = {}
  private readonly onceEventMap: { [eventType: string]: { (event: ebase.EventBase): void }[] } = {}

  private constructor() { }

  public on<T extends ebase.EventBase>(clazz: new (...args: any[]) => T, cb: (event: T) => void): this {
    appLog.debug('EventBus#on()')

    let eventType = new clazz().getType()
    appLog.info(`A handler is registered with event type = '${eventType}'`)

    if (!this.eventMap[eventType]) {
      this.eventMap[eventType] = []
    }
    this.eventMap[eventType].push(cb)
    return this
  }

  public once<T extends ebase.EventBase>(clazz: new (...args: any[]) => T, cb: (event: T) => void): this {
    appLog.debug('EventBus#on()')

    let eventType = new clazz().getType()
    appLog.info(`A handler is registered with event type = '${eventType}'`)

    if (!this.onceEventMap[eventType]) {
      this.onceEventMap[eventType] = []
    }
    this.onceEventMap[eventType].push(cb)
    return this
  }

  public post(event: ebase.EventBase): void {
    appLog.debug('EventBus#post()')

    let eventType = event.getType()
    appLog.info(`Posting a '${eventType}' event`)

    if ((!this.eventMap[eventType] || this.eventMap[eventType].length == 0) &&
      (!this.onceEventMap[eventType] || this.onceEventMap[eventType].length == 0)) {
      appLog.info(`No one cares the ${eventType} event`)
      return
    }

    if(this.eventMap[eventType]){
      setImmediate(
        () => {
          appLog.info('Executing normal handlers')
          for (let cb of this.eventMap[eventType]) {
            cb(event)
          }
        }
      )
    }

    if(this.onceEventMap[eventType]){
      setImmediate(
        () => {
          appLog.info('Executing once handlers')
          for (let cb of this.onceEventMap[eventType]) {
            cb(event)
          }

          appLog.info(`Clear ${this.onceEventMap[eventType].length} once handlers`)
          delete this.onceEventMap[eventType]
        }
      )
    }
  }

  public static readonly instance = new EventBus()
}
