import { EventBase } from '../EventBase'
import { PageEvent } from '../PageEvent'

export class PageDomReadyEvent extends PageEvent {
    constructor(url: string) {
        super('page.dom.ready', url)
    }
}
