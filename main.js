//Example from: https://www.youtube.com/watch?v=jKzBJAowmGg
const electron = require('electron')
const { app, BrowserWindow, Menu, Tray, nativeImage } = electron
const player = require('play-sound')(opts = {})

app.on('ready', () => {
  // let win = new BrowserWindow({ width: 800, height: 600 })
  // win.loadURL(`file://${__dirname}/index.html`)
  // win.webContents.openDevTools()
})

//Exports:
exports.openWindow = () => {
  let win = new BrowserWindow({ width: 400, height: 200 })
  win.loadURL(`file://${__dirname}/bear.html`)
}


let tray = null
app.on('ready', () => {
  tray = new Tray(`${__dirname}/res/tomato.png`)
  const contextMenu = Menu.buildFromTemplate([
    { id: '25', label: '25', type: 'normal', click: menuClick },
    { id: '15', label: '15', type: 'normal', click: menuClick },
    { id: '5', label: '5', type: 'normal', click: menuClick },
    { type: 'separator' },
    { id: '-1', label: 'Quit', type: 'normal', click: menuClick },
  ])
  tray.setToolTip('This is my application.')
  tray.setContextMenu(contextMenu)
})

function menuClick(menuItem, browserWindow, event) {
  if (menuItem.id > 0){
    updateTray(menuItem.id);
  }else if(menuItem.id == -1){
    app.quit();
  }
}

function updateTray(timeLeft) {
  generateImage(timeLeft, (img) => {
    tray.setImage(img);
  });
}

function generateImage(overlayText, updateTray) {
  var Jimp = require("jimp");
  var fileName = `${__dirname}/res/tomato.png`;
  var centralizeX = (overlayText > 9) ? 8 : 12;

  Jimp.read(fileName)
    .then(function (image) {
      loadedImage = image;
      return Jimp.loadFont(Jimp.FONT_SANS_16_BLACK);
    })
    .then(function (font) {
      loadedImage.print(font, centralizeX, 8, overlayText)
        .getBuffer(Jimp.AUTO, function (err, src) {
          var bufferedImage = nativeImage.createFromBuffer(src);
          updateTray(bufferedImage);
        });
    })
    .catch(function (err) {
      console.error(err);
    });
}

function playAlarm() {
  player.play(`${__dirname}/audio/ring.mp3`, function (err) {
    if (err) throw err
  })
}