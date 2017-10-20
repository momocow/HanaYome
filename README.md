# <img src='./assets/icon/app-icon.png' alt='icon' width='32' height='32' /> 花嫁ブラウザ (HanaYome Browser)
### _A WIP browser for DMM webgame, Flower Knight Girl_
> Since it is made by a newbee in NodeJS, any advices via new issues are welcome \_(:з」∠)\_  

[![Build Status](https://travis-ci.org/momocow/HanaYome.svg?branch=master)](https://travis-ci.org/momocow/HanaYome)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/momocow/HanaYome/master/LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/momocow/HanaYome.svg)](https://github.com/momocow/HanaYome/issues)
[![GitHub stars](https://img.shields.io/github/stars/momocow/HanaYome.svg)](https://github.com/momocow/HanaYome/stargazers)
[![Game link](https://img.shields.io/badge/game-FKG-ff69b4.svg)](pc-play.games.dmm.co.jp/play/flower)

## TODO
- [ ] rewriting scripts following the NodeJS-supported ES6 standard  
> Except `import`/`export` since the concern about ES6 vs CommonJS
> is the compatibility for browsers; however, the Hanayome is an desktop application and does not depend on browsers. It uses Electron to build the app and already has a Chromium inside.

- [ ] reconstructing the project using AngularJS
- [ ] a version control system including auto-update
- [ ] a proxy server to listen for the game packets

## Current Progress
- [x] a independent and adaptive browser window using Chromium
- [x] automatically resizing the game view to fit the window
- [x] ignoring the alert by DMM token expiration
- [x] mutable audio
- [x] able to capture a screenshot into the clipboard
- [x] app icon

## Download executables
- [from Google drive](https://drive.google.com/open?id=0B3_3qzw-W0QVTENkbEpoWUdHekE)

## For developers
#### Set up the environment
1. Download the source code  
`git clone https://github.com/momocow/HanaYome.git`
2. Install dependencies  
`npm install`

#### Build
Use `gulp build` to build executables for all platforms
