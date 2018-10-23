const electron = require('electron')
const { app, BrowserWindow, Menu, Tray, nativeImage } = electron
const Timr = require('timrjs')
const notifier = require('node-notifier')
const trayImg = `${__dirname}/res/tomato.png`
const trayImgAlert = `${__dirname}/res/yomato.png`
const { ipcMain } = require('electron');

let useBiggerFonts = false
let timer = Timr(0)
let tray = null
let alertMode = false
let invisibleRenderer = null;

app.on('ready', () => {
  useBiggerFonts = (process.platform == "win32")
  tray = new Tray(trayImg)
  const contextMenu = Menu.buildFromTemplate([
    { id: '25', label: '25', type: 'normal', click: menuClick },
    { id: '15', label: '15', type: 'normal', click: menuClick },
    { id: '5', label: '5', type: 'normal', click: menuClick },
    { type: 'separator' },
    { id: '-1', label: 'Quit', type: 'normal', click: menuClick },
  ])
  resetTray()
  tray.setContextMenu(contextMenu)
  tray.on('click', () => {
    if (alertMode){
      disableAlertMode();
    }
  })
  invisibleRenderer = new BrowserWindow({width: 100, height: 100, show: false})
  invisibleRenderer.loadURL(`${__dirname}/renderer.html`);
})

function enableAlertMode(){
  alertMode = true;
}

function disableAlertMode(){
  timer.stop()
  alertMode = false
  resetTray()
}

function menuClick(menuItem, browserWindow, event) {
  if (menuItem.id > 0) {
    disableAlertMode()
    startTimer(menuItem.id);
  } else if (menuItem.id == -1) {
    app.quit();
  }
}

function updateTray(timeLeft) {
  generateImage(timeLeft.toString(), (img) => {
    tray.setImage(img);
  });
}

function resetTray() {
  tray.setToolTip('Pomodorino by Merurino')
  tray.setImage(trayImg)
}

function generateImage(overlayText, setTrayImageClosure) {
  let Jimp = require("jimp");
  let fileName = `${__dirname}/res/tomato.png`;
  let calculatedY = useBiggerFonts ? 0 : 8
  let calculatedX = useBiggerFonts ? 
       (overlayText.length > 1) ? 0 : 8
     : (overlayText.length > 1) ? 8 : 12

  Jimp.read(fileName)
    .then(function (image) {
      loadedImage = image;
      return Jimp.loadFont(useBiggerFonts ? Jimp.FONT_SANS_32_BLACK : Jimp.FONT_SANS_16_BLACK);
    })
    .then(function (font) {
      loadedImage.print(font, calculatedX, calculatedY, overlayText)
        .getBuffer(Jimp.AUTO, function (err, src) {
          let bufferedImage = nativeImage.createFromBuffer(src);
          setTrayImageClosure(bufferedImage);
        });
    })
    .catch(function (err) {
      console.error(err);
    });
}

function finishPomodoro() {
  let AudioConfig = {
    source: `${__dirname}/audio/ring-fixed-bitrate.mp3`
  };

  notifier.notify({
    'title': 'Pomodorino',
    'message': 'Your pomodoro has finished',
    'icon': `${__dirname}/res/tomato.png`,
    wait: true
  });
  invisibleRenderer.webContents.send('play-audio', AudioConfig);
  enableAlertMode()
}

function startTimer(time) {
  timer.destroy()
  timer = Timr(time * 60)
  timer.start();
  timer.ticker(({ formattedTime, raw }) => {
    if (!alertMode){
      tray.setToolTip(`Pomodorino: ${formattedTime} left`)
      if (raw.currentMinutes > 0 && raw.currentSeconds == 59) {
        updateTray(+raw.currentMinutes + 1)
      }
      if (raw.currentMinutes == 0 && raw.currentSeconds != 0) {
        updateTray(+raw.currentSeconds)
      }
    }
    else{  
      tray.setImage(raw.currentSeconds % 2 == 0 ? trayImgAlert : trayImg)      
    }
  });
  timer.finish((self) => {
    if (!alertMode){
      finishPomodoro();
      resetTray();
      timer.start(1500);
    }
  });
}