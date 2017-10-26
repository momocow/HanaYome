import * as electron from 'electron'
import * as fs from 'fs-extra'
import * as notifier from 'node-notifier'
import * as path from 'path'

import * as globals from '../../globals'

export function screenshot(view: Electron.WebviewTag) {
  return function() {
    view.capturePage({ x: 0, y: 0, width: 1200, height: 800 }, processImage)
  }
}

export function getScreenshotPath(): string {
  return path.resolve(
    globals.paths.USERDATA_PATH,
    globals.appConfig.get('hanayome.screenshot.path')
  )
}

export function processImage(image: Electron.nativeImage) {
  image = image.resize({
    width: 960,
    height: 640
  })

  let imageBuffer: Buffer | string, imageExt: string, imageType: string
  switch ((<string>globals.appConfig.get("hanayome.screenshot.format")).toLowerCase()) {
    case 'jpeg':
    case "jpg":
      imageType = 'jpeg'
      imageExt = 'jpg'
      imageBuffer = image.toJPEG(globals.appConfig.get("hanayome.screenshot.jpg.quality"))
      break
    case "bmp":
    case 'bitmap':
      imageType = imageExt = 'bmp'
      imageBuffer = image.toBitmap({
        scaleFactor: globals.appConfig.get("hanayome.screenshot.bmp.scale")
      })
      break
    case 'data-url':
    case 'dataurl':
    case 'data':
    case 'url':
      imageType = 'url'
      imageExt = globals.appConfig.get("hanayome.screenshot.url.ext")
      imageBuffer = image.toDataURL({
        scaleFactor: globals.appConfig.get("hanayome.screenshot.url.scale")
      })
      break
    default:
      imageType = imageExt = 'png'
      imageBuffer = image.toPNG({
        scaleFactor: globals.appConfig.get("hanayome.screenshot.png.scale")
      })
  }

  if (globals.appConfig.get("hanayome.screenshot.mode") == "disk") {
    let imageFile = getFilename(imageExt)
    fs.outputFile(imageFile, imageBuffer)
      .then(function() {
        globals.LOGGER.info(`A screenshot image is saved to ${imageFile}`)
        notifier.notify({
          title: globals.paths.APP_DISPLAY_NAME,
          message: globals.I18N('screenshotSavedInDisk', {path: imageFile}),
          icon: globals.paths.ICON_PNG,
          wait: true
        })
        notifier.on('click', function(){
          electron.shell.showItemInFolder(imageFile)
        })
      })
  }
  else {
    try{
      if (imageType == 'url') {
        electron.clipboard.writeText(<string>imageBuffer)
      }
      else {
        image = electron.nativeImage.createFromBuffer(<Buffer>imageBuffer)
        electron.clipboard.writeImage(image)
      }
      globals.LOGGER.info('A screenshot image is written into the clipboard')
      notifier.notify({
        title: globals.paths.APP_DISPLAY_NAME,
        message: globals.I18N('screenshotInClipboard'),
        icon: globals.paths.ICON_PNG
      })
    }
    catch(err){
      globals.LOGGER.error('clipboard error')
      globals.LOGGER.error(err)
    }
  }
}

// # Supported macro: ${year} ${yy} ${month} ${date} ${day} ${hour} ${min} ${sec} ${timestamp}
function getFilename(ext: string): string {
  let now = new Date()
  let fnTemplate = globals.appConfig.get("hanayome.screenshot.filename")

  let filename = fnTemplate
    .replace('${year}', now.getFullYear())
    .replace('${yy}', now.getFullYear().toString().substr(-2))
    .replace('${month}', now.getMonth() + 1)
    .replace('${date}', now.getDate())
    .replace('${day}', now.getDay())
    .replace('${hour}', now.getHours())
    .replace('${min}', now.getMinutes())
    .replace('${sec}', now.getSeconds())
    .replace('${timestamp}', now.getTime())
    .trim()

  // if the file exists or not
  let root = getScreenshotPath(), filePath: string
  for (let i = 0; true; i++) {
    let dup = globals.appConfig.get("hanayome.screenshot.duplicate").replace('${dup}', i)
    filePath = path.join(root, `${filename}${(i == 0) ? '' : dup}.${ext}`)
    if (!fs.existsSync(filePath)) break
  }

  return filePath
}
