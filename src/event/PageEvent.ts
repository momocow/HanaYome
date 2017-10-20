import { EventBase } from './EventBase'

export abstract class PageEvent extends EventBase {
    private readonly URL: string
    constructor(type: string, url: string) {
        super(type)

        this.URL = url
    }

    public getURL() {
      return this.URL
    }
}
