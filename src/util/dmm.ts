///<reference path='../../node_modules/typescript/lib/lib.es6.d.ts'/>

export function isFKGPage(urlString: string): boolean{
  return urlString.includes('http://pc-play.games.dmm.co.jp/play/flower-x')
}

export function isLoginPage(urlString: string): boolean{
  return urlString.includes('https://www.dmm.co.jp/my/-/login/=/path=')
}

export const flashWidth = 960
export const flashHeight = 640
