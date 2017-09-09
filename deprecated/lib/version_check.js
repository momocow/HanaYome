const defered = require("q").defer()
const https = require("https")
const {app} = require("electron")
const CSON = require("cson")
const vcmp = require("node-version-compare")
const {configs} = global

// app.getVersion()

https.get(configs.resource.versions, (res) => {
  const { statusCode } = res
  const contentType = res.headers['content-type']
  
  let error
  if (statusCode !== 200) {
    error = new Error('Request Failed.\n' +
                      `Status Code: ${statusCode}`)
  }
  else if (!/^text\/plain/.test(contentType)) {
    error = new Error('Invalid content-type.\n' +
                      `Expected text/plain but received ${contentType}`)
  }
  if (error) {
    logger.error(error.message)
    res.resume()
    return;
  }

  res.setEncoding('utf8')
  let rawData = ''
  res.on('data', (chunk) => { rawData += chunk; })
  res.on('end', () => {
    try {
      const hanayome_ver = CSON.parse(rawData).hanayome
      const vers = hanayome_ver.versions
      const types = Object.keys(hanayome_ver.versions)
      var new_ver = []

      for(var type of types){
        if(vers[type]){
          if(vcmp(vers[type], app.getVersion()) > 0){
            new_ver.push({type: type, version: vers[type]})
          }
        }
      }
      defered.resolve(new_ver)
    } catch (e) {
      logger.error(e.message)
    }
  })
}).on('error', (e) => {
  logger.error(`Got error: ${e.message}`)
})

module.exports=defered.promise
