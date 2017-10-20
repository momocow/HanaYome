import { EventBase } from '../EventBase'
import { PageEvent } from '../PageEvent'

export class PageLoadedEvent extends PageEvent {
    constructor(url: string) {
        super('page.load.post', url)
    }
}
