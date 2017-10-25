// this script is currently unused
//
import * as electron from 'electron'
import * as _ from 'lodash'

import { I18N } from '../globals'



export function translateUpdatingUI(){
  for(let translater of _.values(UITranslater)){
    translater()
  }
}

export function translate(uid: string){
  UITranslater[uid]()
}

const UITranslater = {
  "#version":function(){
    window.$('#version').before(I18N('currentVersion'))
  },
  "#startUpdate":function(){
    window.$('#startUpdate').text(I18N('startUpdate'))
  },
  "#cancelUpdate":function(){
    window.$('#cancelUpdate').text(I18N('cancelUpdate'))
  }
}
