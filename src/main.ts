import { app, BrowserWindow, Menu, Tray, nativeImage, MenuItem } from 'electron';
/*
  Timr Must be imported like this, or when we transpile it it will convert `Timr(0);` 
  to `timrjs_1.default(0);` which will break things.
*/
import * as Timr from 'timrjs';
import { Alerts } from './alerts'

const dir = `${__dirname}/..`;
const trayImg = `${dir}/res/tomato.png`
const trayImgAlert = `${dir}/res/yomato.png`

let useBiggerFonts = false
let timer = Timr(0);
let tray = null
let alertMode = false

let alerts: Alerts = null;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
// let invisibleRenderer: Electron.BrowserWindow = null

function appReady() {
  let invisibleRenderer = new BrowserWindow(
    {
      width: 100,
      height: 100,
      show: false,
      webPreferences: { nodeIntegration: true }
    })
  invisibleRenderer.loadURL(`file://${dir}/src/renderer.html`);
  alerts = new Alerts(invisibleRenderer, `${dir}`);
  useBiggerFonts = (process.platform == "win32")
  tray = new Tray(trayImg)
  const contextMenu = Menu.buildFromTemplate([
    {
      id: '900', label: "Config", type: "submenu", submenu: [
        { id: '999', label: "Sound", type: "checkbox", checked: alerts.shouldPlayAudio, click: (item: MenuItem) => alerts.configurePlayAudio(item.checked) },
        { id: '998', label: "Notification", type: "checkbox", checked: alerts.shouldNotify, click: (item: MenuItem) => alerts.configureNotification(item.checked) },
      ]
    },
    { id: '25', label: '25', type: 'normal', click: menuClick },
    { id: '15', label: '15', type: 'normal', click: menuClick },
    { id: '5', label: '5', type: 'normal', click: menuClick },
    { type: 'separator' },
    { id: '-1', label: 'Quit', type: 'normal', click: menuClick },
  ])
  resetTray()
  tray.setContextMenu(contextMenu)
  tray.on('click', () => {
    if (alertMode) {
      disableAlertMode();
    }
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', appReady);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  // if (mainWindow === null) {
  //   appReady()
  // }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

function enableAlertMode() {
  alertMode = true;
}

function disableAlertMode() {
  timer.stop()
  alertMode = false
  resetTray()
}

function menuClick(menuItem) {
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
  let fileName = `${dir}/res/tomato.png`;
  let calculatedY = useBiggerFonts ? 0 : 8
  let calculatedX = useBiggerFonts ?
    (overlayText.length > 1) ? 0 : 8
    : (overlayText.length > 1) ? 8 : 12

  let loadedImage = null
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
  alerts.notify();
  alerts.playAudio();
  enableAlertMode()
}

function startTimer(time) {
  timer.destroy()
  timer = Timr(time * 60)
  timer.start();
  timer.ticker(({ formattedTime, raw }) => {
    if (!alertMode) {
      tray.setToolTip(`Pomodorino: ${formattedTime} left`)
      if (raw.currentMinutes > 0 && raw.currentSeconds == 59) {
        updateTray(+raw.currentMinutes + 1)
      }
      if (raw.currentMinutes == 0 && raw.currentSeconds != 0) {
        updateTray(+raw.currentSeconds)
      }
    }
    else {
      tray.setImage(raw.currentSeconds % 2 == 0 ? trayImgAlert : trayImg)
    }
  });
  timer.finish(() => {
    if (!alertMode) {
      finishPomodoro();
      resetTray();
      timer.start(1500);
    }
  });
}