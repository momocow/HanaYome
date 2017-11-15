import * as electron from 'electron'
import * as channels from '../../channels'
import * as config from '../../util/config'
import * as globals from '../../view/globals'

import { ViewLogger } from '../../view/service/logging'
import { $ } from '../../view/jquery'

const translate = electron.remote.getGlobal('i18n')
const IS_DEBUG_MODE = <boolean>electron.remote.getGlobal('IS_DEBUG_MODE')
const LOGGER = new ViewLogger((IS_DEBUG_MODE) ? "debug" : "error")
const appConfig = (<(configName: string) => config.Config>electron.remote.getGlobal('getConfig'))('app')

$(window).on('keydown', function(e) {
  if (e.keyCode == 123) { //f12
    LOGGER.info('[F12] Open devTools for the focused window')
    electron.remote.getCurrentWebContents().openDevTools({
      mode: "undocked"
    })
  }
})

$("#tab-screenshot").append(translate('tabScreenshot'))
$("#tab-log").append(translate('tabLog'))
$("#tab-update").append(translate('tabUpdate'))
$("#tab-about").append(translate('tabAbout'))

$("#label-screenshotDir").prepend(translate('screenshotDirLabel'))

let currentSSPath = appConfig.get("hanayome.screenshot.path")
$("#screenshotDir").attr('placeholder', currentSSPath)
$("#screenshotDir").val(currentSSPath)

$("#selectScreenshotDir").text(translate('selectScreenshotDir'))
  .on('click', function() {
    electron.ipcRenderer.once(channels.MainCall.dirDialogResult, function(e, ssdir: string) {
      if(ssdir){
        $("#screenshotDir").val(ssdir)
      }
    })
    electron.ipcRenderer.send(channels.MainCall.openDirDialog)
  })

// let Bloodhound = window['Bloodhound']
// let states = new Bloodhound({
//   datumTokenizer: function(d) { return Bloodhound.tokenizers.whitespace(d.word); },
//   queryTokenizer: Bloodhound.tokenizers.whitespace,
//   identify: function(obj) { return obj.word; },
//   limit: 9,
//   local: [
//     { word: "${year}", desc: 'the full year, e.g. 2017' },
//     { word: "${yy}", desc: '' },
//     { word: "${month}", desc: '' },
//     { word: "${date}", desc: '' },
//     { word: "${day}", desc: '' },
//     { word: "${hour}", desc: '' },
//     { word: "${min}", desc: '' },
//     { word: "${sec}", desc: '' },
//     { word: "${timestamp}", desc: '' }
//   ]
// });
//
// states.initialize();
//
// $('#screenshotFilename').typeahead(null, {
//   name: 'filename-macro',
//   display: 'word',
//   source: states.ttAdapter(),
//   templates:{
//     suggestion: function(obj){
//       console.log(obj)
//       return `<div><strong>${obj.word}</strong> – ${obj.desc}</div>`
//     }
//   }
// })

// $("#label-screenshotFilename").prepend(translate("screenshotFilenameLabel"))
//
// $("#label-screenshotDuplicate").prepend(translate('screenshotDuplicateLabel'))
//

$('#label-log-compressed').append(translate('compressLog'))
$('#label-log-not-compressed').append(translate('notCompressLog'))
$('label:has([data-toggle=radio])').on('click', function (event) {
  let clicked = $(event.target)
  if (clicked.is('[data-toggle=radio] + .icons span')) {
    clicked.parent().siblings('[data-toggle=radio]').click()
  } else {
    clicked.find('[data-toggle=radio]').click()
  }
})

$('label:has([data-toggle=radio])').hover(function (e) {
  let hovered = $(event.target), iconSets = $(event.target).find('.icons')
  if (hovered.is('[data-toggle=radio] + .icons span')) {
    iconSets = hovered.parent()
  }
  if (iconSets.siblings('[data-toggle=radio]').prop("checked")) return

  iconSets.find('.icon-unchecked').css('opacity', 0)
  iconSets.find('.icon-checked').css('opacity', 1)
}, function (e) {
  let hovered = $(event.target), iconSets = $(event.target).find('.icons')
  if (hovered.is('[data-toggle=radio] + .icons span')) {
    iconSets = hovered.parent()
  }
  if (iconSets.siblings('[data-toggle=radio]').prop("checked")) return

  iconSets.find('.icon-unchecked').css('opacity', 1)
  iconSets.find('.icon-checked').css('opacity', 0)
})

let shouldCompress = appConfig.get('hanayome.logs.compress')
$('#pane-log :radio').radiocheck("enable").filter(`[value=${shouldCompress}]`).radiocheck("check")

$('#labelAutoUpdateCheck').append(translate('autoCheckUpdate'))

let shouldCheck = appConfig.get('hanayome.update.check') ? 'check' : 'uncheck'
$('#autoCheckUpdate').radiocheck(shouldCheck)

$('#immediatelyCheck').text(translate('checkUpdateNow'))
$('#immediatelyCheck').on('click', function (e) {
  electron.ipcRenderer.send(channels.ConfigWindow.checkUpdate)
})

$('#app-icon').append(`<img alt='icon.png' src='${globals.paths.ICON_PNG}'>`)
$('#app-version').append(`v${globals.paths.APP_VERSION}`)
$('#body-about').prepend(translate('bodyAbout'))
$('#ghlink').on('click', function () {
  electron.shell.openExternal('https://github.com/momocow/HanaYome')
})

$(window).on('beforeunload', function () {
  let configObj = {}, form = $('#configForm').get(0)

  configObj['screenshotPath'] = form['screenshotDir'].value
  configObj['shouldLogCompressed'] = form['logCompressed'].value == 'true'
  configObj['shouldAutoCheckUpdate'] = form['autoCheckUpdate'].checked

  electron.ipcRenderer.send(channels.ConfigWindow.newConfig, configObj)
})
