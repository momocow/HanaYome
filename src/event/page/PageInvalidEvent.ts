import { EventBase } from '../EventBase'
import { PageEvent } from '../PageEvent'

export class PageInvalidEvent extends PageEvent {
    constructor(url: string) {
        super('page.invalid', url)
    }
}
