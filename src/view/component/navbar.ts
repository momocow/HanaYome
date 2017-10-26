import * as electron from 'electron'
import * as path from 'path'
import * as utils from 'util'

import * as screenshot from './util/screenshot'
import * as globals from '../globals'
import * as channels from '../../channels'
import { $ } from '../jquery'

let isInitialized = false

export function init() {
  globals.LOGGER.debug('navbar#init()')

  if (!isInitialized) {
    let FKG_View = <Electron.WebviewTag>globals._$('FKG>webview')

    $("#btn-refresh").on('click', function() {
      FKG_View.reload()
    })

    $("#btn-volume").on('click', function() {
      globals.LOGGER.info(`Set audio muted=${!FKG_View.isAudioMuted()}`)
      FKG_View.setAudioMuted(!FKG_View.isAudioMuted())
      update()
    })

    $("#btn-screenshot").on('click', screenshot.screenshot(FKG_View))

    // init state
    $('#dropdown-screenshot-mode').hide()

    $("#btn-screenshot-mode").on('click', function() {
      if ($('#dropdown-screenshot-mode').is(":visible")) {
        $('#dropdown-screenshot-mode').hide()
      }
      else {
        $('#dropdown-screenshot-mode').show()
      }
    })

    $(document).on('click', function(e) {
      if (!$(e.target).closest("#btn-screenshot-mode").length
        && !$(e.target).closest('#dropdown-screenshot-mode').length) {
        if ($('#dropdown-screenshot-mode').is(":visible")) {
          $('#dropdown-screenshot-mode').hide()
        }
      }
    })

    $("#label-clipboard").append(globals.I18N("screenshotToClipboard"))
    $("#label-disk").append(globals.I18N("screenshotToDisk"))

    let currentSSMode = globals.appConfig.get("hanayome.screenshot.mode")
    $("#dropdown-screenshot-mode :radio").radiocheck("enable")
      .filter(`[value=${currentSSMode}]`).radiocheck("check")

    $("#dropdown-screenshot-mode :radio").on('change.radiocheck', function() {
      let ssMode = $("#dropdown-screenshot-mode :radio:checked").val()
      globals.appConfig.set("hanayome.screenshot.mode", ssMode)
      globals.LOGGER.info(`Screenshot mode was changed to '${ssMode}'`)
    })

    $('#showScreenshotPath').text(globals.I18N('showScreenshotPath'))
    $('#showScreenshotPath').on('click', function() {
      electron.shell.showItemInFolder(path.join(screenshot.getScreenshotPath(), '#'))
    })

    $("#btn-settings").on('click', function() {
      electron.ipcRenderer.send(channels.ConfigWindow.open)
    })

    isInitialized = true
  }
}

export function update() {
  let FKG_View = <Electron.WebviewTag>globals._$('FKG>webview')
  if (FKG_View.isAudioMuted()) {
    $("#btn-volume > i.fa-volume-up").css('display', 'none')
    $("#btn-volume > i.fa-volume-off").css('display', 'inline-block')
  }
  else {
    $("#btn-volume > i.fa-volume-up").css('display', 'inline-block')
    $("#btn-volume > i.fa-volume-off").css('display', 'none')
  }
}
