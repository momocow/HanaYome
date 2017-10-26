import * as _ from 'lodash'

class WindowHandler {
  private winMap: { [name: string]: Electron.BrowserWindow } = {}

  public register(name: string, win: Electron.BrowserWindow) {
    if (win && !this.winMap[name]) {
      this.winMap[name] = win
    }
  }

  public unregister(name: string) {
    delete this.winMap[name]
  }

  public get(name: string) {
    return this.winMap[name]
  }

  public getFocusedWindow() {
    for (let win of _.values(this.winMap)) {
      if (win.isFocused) {
        return win
      }
    }
  }
}

export const windowHandler = new WindowHandler()
