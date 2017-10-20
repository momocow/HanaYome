import * as schedule from '../util/Schedule'
import { appConfig } from './configuring'

let loopDelay = appConfig.get('hanayome.schedule.loopDelay')

export const scheduler = new schedule.Schedule(loopDelay)

export { Routine, Priority, PeriodicRoutine, ShiveringPeriodicRoutine, constants as unit } from '../util/Schedule'
