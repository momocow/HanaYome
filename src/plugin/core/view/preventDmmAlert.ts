import * as kit from '../../view-kit'
try{
  window['DMM'].netgame.reloadDialog=()=>{}
  kit.LOGGER.info('Has prevented DMM from reload warning')
}
catch(err){
  kit.LOGGER.warn('DMM.netgame does not exist')
}
