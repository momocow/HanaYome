/**
 * Re-encapsulate and force to throw an Error object
 */
export function throwError(err: any, prepend: string = '', append: string = ''): void{
  if(!(err instanceof Error)){
    err = new Error(err.toString())
  }
  err.message = prepend + err.message.toString() + append
  throw err
}
