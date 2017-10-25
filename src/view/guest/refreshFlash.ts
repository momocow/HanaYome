import * as globals from '../globals'

let container = document.getElementById('externalContainer')

if(container){
  let tmpFlash = container.innerHTML
  container.innerHTML = ''
  container.innerHTML = tmpFlash

  globals.LOGGER.info('Flash is refreshed.')
}
