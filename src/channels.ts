export namespace MainCall{
  export const openDirDialog = "dialog.dir.open"
  export const dirDialogResult = "dialog.dir.result"
}

export namespace RendererEvent {
  export const pageStartLoading = "page.load.pre"
  export const pageStopLoading = "page.load.post"
  export const pageFailLoading = "page.load.error"
  export const pageDomReady = "page.dom.ready"
}

export namespace RendererLog {
  export const logging = "view.log"
}

export namespace RendererCall{
  export const callFitScrollDim = "call.fit-scroll-dim"
}

export namespace RendererRequire{
  export const request = "renderer.require"
  export const result = "renderer.require.result"
}

export namespace FKGView{
  export const fetchID = "FKGView.id"
  export const require = "FKGView.require"
  export const requireResult = "FKGView.require.result"
  export const fetchSize = "FKGView.size.get"
  export const setSize = "FKGView.size.set"
  export const screenshot = "FKGView.screenshot"
}

export namespace DevTools{
  export const forFocusedWindow = "focused.devtools.open"
}

export namespace ConfigWindow{
  export const open = "config.window.open"
  export const checkUpdate = "config.window.update"
  export const updateResult = "config.window.update.result"
  export const newConfig = "config.window.apply"
}
