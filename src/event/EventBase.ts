import * as events from 'events'

export abstract class EventBase {
  private readonly TYPE: string
  private readonly TIME: Date

  constructor(type: string) {
    this.TYPE = type
    this.TIME = new Date()
  }

  public getType() {
    return this.TYPE
  }

  public getTime() {
    return this.TIME
  }
}
