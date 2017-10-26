import * as electron from 'electron'
import * as channels from '../../channels'
import * as config from '../../util/config'

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

let Bloodhound = window['Bloodhound']
let states = new Bloodhound({
  datumTokenizer: function(d) { return Bloodhound.tokenizers.whitespace(d.word); },
  queryTokenizer: Bloodhound.tokenizers.whitespace,
  limit: 9,
  local: [
    { word: "${year}" },
    { word: "${yy}" },
    { word: "${month}" },
    { word: "${date}" },
    { word: "${day}" },
    { word: "${hour}" },
    { word: "${min}" },
    { word: "${sec}" },
    { word: "${timestamp}" }
  ]
});

states.initialize();

$('#screenshotFilename').typeahead(null, {
  name: 'states',
  displayKey: 'word',
  source: states.ttAdapter()
})

$("#label-screenshotFilename").prepend(translate("screenshotFilenameLabel"))
