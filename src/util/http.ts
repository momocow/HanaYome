import * as request from 'request'

export function getJson(uri: string, onComplete: (err: any, result: any) => void): request.Request {
  return request.get(uri, { json: true }, function(err, resp, body) {
    if (err) {
      onComplete(err, undefined)
      return
    }
    if (resp.statusCode != 200) { return}
    onComplete(null, body)
  })
}

export {
  getJson as getJSON
}
