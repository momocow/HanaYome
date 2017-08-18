# ![icon](./app.ico) 花嫁ブラウザ (HanaYome Browser)
### _A WIP browser for DMM webgame, Flower Knight_
> Since it is made by a newbee in NodeJS, any advices via new issues are welcome \_(:з」∠)\_

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

## Downloads
[Google drive](https://drive.google.com/open?id=0B3_3qzw-W0QVTENkbEpoWUdHekE)
