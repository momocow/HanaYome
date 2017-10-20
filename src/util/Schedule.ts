import * as _ from 'lodash'

import * as random from './random'

export class Schedule {
  private timeTable: { [time: number]: Routine[] } = {}

  /**
   * always sorted
   */
  private scheduledSlotList: number[] = []

  public constructor(private readonly emptyLoopPeriod: number) { }

  /**
   * Create a routine and schedule it on the time table
   */
  public schedule(routine: Routine): this {
    if (!Array.isArray(this.timeTable[routine.INDEX])) {
      this.timeTable[routine.INDEX] = []
    }

    if (this.scheduledSlotList.indexOf(routine.INDEX) < 0) {
      this.scheduledSlotList.splice(
        _.sortedIndex(this.scheduledSlotList, routine.INDEX),
        0,
        routine.INDEX
      )
    }

    this.timeTable[routine.INDEX].splice(
      _.sortedIndexBy(this.timeTable[routine.INDEX], routine, 'time'),
      0,
      routine)

    return this
  }


  /**
   * Use the scheduled Routine object to cancel the routine
   */
  public cancel(target: Routine): this {
    if (Array.isArray(this.timeTable[target.INDEX])) {
      let index = this.timeTable[target.INDEX].indexOf(target)
      this.timeTable[target.INDEX].splice(index, 1)
    }

    if (_.isEmpty(this.timeTable[target.INDEX])) {
      delete this.timeTable[target.INDEX]

      let index = this.scheduledSlotList.indexOf(target.INDEX)
      if (index >= 0) {
        this.scheduledSlotList.splice(index, 1)
      }
    }

    return this
  }

  /**
   * Provide a new Routine object to update the schedule
   */
  public update(target: Routine, newRountine: Routine): this {
    return this.cancel(target).schedule(newRountine)
  }

  public start() {
    this.doRoutines()
  }

  private doRoutines() {
    let finishedSlotIndex = -1, now = _.now()
    for (let slot of this.scheduledSlotList) {
      if (slot > now) break // not yet

      for (let routine of this.timeTable[slot]) {
        routine.callback()
        if (routine instanceof PeriodicRoutine) {
          this.schedule(routine.getNext())
        }
      }

      finishedSlotIndex++
    }

    if (finishedSlotIndex >= 0) {
      // remove finished rountines
      for (let finished of this.scheduledSlotList.slice(0, finishedSlotIndex)) {
        delete this.timeTable[finished]
      }
      this.scheduledSlotList = this.scheduledSlotList.slice(finishedSlotIndex + 1)
    }

    setTimeout(() => {
      this.doRoutines()
    }, this.getNextTick())
  }

  private getNextTick(): number {
    if (this.scheduledSlotList.length > 0) {
      if (this.scheduledSlotList[0] <= _.now()) { //something expires, do it asap
        return 1
      }
      return this.scheduledSlotList[0] - _.now()
    }

    return this.emptyLoopPeriod
  }
}

export enum Priority {
  HIGHEST,
  HIGHER,
  NORMAL,
  LOWER,
  LOWEST
}

export class Routine {
  public readonly INDEX: number

  constructor(
    public readonly time: Date,
    public readonly priority: Priority,
    public readonly callback: (...args: any[]) => void) {

    this.time = new Date(this.time.getTime() + 10)
    this.INDEX = this.time.getTime()
  }
}

export class PeriodicRoutine extends Routine {
  constructor(
    public readonly time: Date,
    public readonly priority: Priority,
    public readonly callback: (...args: any[]) => void,
    public readonly period: number) {
    super(time, priority, callback)
  }

  public getNext(): PeriodicRoutine {
    let nextTime = new Date(this.time.getTime() + this.period)
    return new PeriodicRoutine(nextTime, this.priority, this.callback, this.period)
  }
}

export class ShiveringPeriodicRoutine extends PeriodicRoutine {
  constructor(
    public readonly time: Date,
    public readonly priority: Priority,
    public readonly callback: (...args: any[]) => void,
    public readonly period: number,
    public readonly mu: number) {
    super(time, priority, callback, period)
  }

  public getNext(): ShiveringPeriodicRoutine {
    let nextTime = new Date(this.time.getTime() + random.normal(this.period, this.mu))
    return new ShiveringPeriodicRoutine(nextTime, this.priority, this.callback, this.period, this.mu)
  }
}

export namespace constants {
  export const SEC = 1000
  export const MIN = 60 * SEC
  export const HOUR = 60 * MIN
  export const DAY = 24 * HOUR
}
