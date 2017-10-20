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

export namespace FKGView{
  export const fetchID = "FKGView.id"
  export const require = "FKGView.require"
  export const requireResult = "FKGView.require.result"
  export const fetchSize = "FKGView.size.get"
  export const setSize = "FKGView.size.set"
}
