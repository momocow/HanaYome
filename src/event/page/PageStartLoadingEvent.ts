import { EventBase } from '../EventBase'
import { PageEvent } from '../PageEvent'

export class PageStartLoadingEvent extends PageEvent {
    constructor(url: string) {
        super('page.load.pre', url)
    }
}
