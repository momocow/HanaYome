const {exec} = require('child_process')

console.log('**************************')
console.log(' This is the dev package.\n')
console.log('**************************\n')

try{
    let script = 'npm start --prefix ./app'
    if(process.argv.indexOf('-p') < 0 && process.argv.indexOf('--prod') < 0 ){
        script += ' -- --dev'
    }

    console.log(`> ${script}\n`)
    let mainApp = exec(script, exit)
    mainApp.stdout.on('data', console.log)
    mainApp.stderr.on('data', console.log)
}
catch(err){
    console.log(err)
    console.log('Oops! Fail to execute `npm start --prefix ./app`')
    exit()
}

function exit(err){
    if(err){
      console.log('Oops! Maybe you haven\'t built the app yet')
      console.log('Install gulp with `npm install gulp -g` and try `npm run build` or `gulp build:app`\n')
    }
    console.log('**************************')
    console.log('The dev package exits\n')
    console.log('**************************\n')
    require('electron').app.exit(0)
}
