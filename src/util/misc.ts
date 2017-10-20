export function ensureThis(context: any, func: (...args: any[]) => void, ...args: any[]) {
  return function(...cb_args: any[]){
    func.call(context, ...cb_args, ...args)
  }
}
