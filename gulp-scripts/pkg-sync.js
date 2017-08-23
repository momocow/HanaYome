const fs = require("fs-extra")
const path = require("path")
const _ = require("lodash")

const dev_pkg = './package.json'
const product_pkg = './src/package.json'


function syncProductPkg(){
  try{
    let product = require(path.resolve(product_pkg))
    if(_.has(product, "devDependencies")){
      delete product.devDependencies
    }
    product.dependencies = _.clone(require(path.resolve(dev_pkg)).dependencies)
    fs.writeJsonSync(product_pkg, product, {spaces: '\t'})
  }
  catch(e){
    console.error("Fail to sync with production package.json")
    console.error(e)
  }
}

module.exports = {
  sync: syncProductPkg
}
