import { app, BrowserWindow, Menu, MenuItem } from 'electron';
import { Alerts } from './alerts';
import { PomoEngine } from './pomoEngine';
import * as path from 'path';

const dir = path.join(__dirname,'/..');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
// let invisibleRenderer: Electron.BrowserWindow = null
let alerts: Alerts = null;
let pomo: PomoEngine = null;

function appReady() {
  //We need to add this for windows to behave properly: https://github.com/electron/electron/issues/10864
  //This fixes the notifications for example.
  app.setAppUserModelId("Pomodorino"); //Must be the same as build.appId in package.json
  
  let invisibleRenderer = new BrowserWindow(
    {
      width: 100,
      height: 100,
      show: false,
      webPreferences: { nodeIntegration: true }
    })
  invisibleRenderer.loadURL(`file://${path.join(dir,'/src/renderer.html')}`);
  alerts = new Alerts(invisibleRenderer, `${dir}`);
  pomo = new PomoEngine(alerts, generateContextMenu(), dir);
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

function cleanUpAndQuit(){
  alerts = null;
  pomo = null;
  app.quit();
}

function generateContextMenu(): Menu {
  return Menu.buildFromTemplate([
    {
      id: '900', label: "Config", type: "submenu", submenu: [
        { id: '999', label: "Sound", type: "checkbox", checked: alerts.shouldPlayAudio, click: (item: MenuItem) => alerts.configurePlayAudio(item.checked) },
        { id: '998', label: "Notification", type: "checkbox", checked: alerts.shouldNotify, click: (item: MenuItem) => alerts.configureNotification(item.checked) },
        { id: '997', label: "Blinking", type: "checkbox", checked: alerts.shouldBlink, click: (item: MenuItem) => alerts.configureBlinking(item.checked) },
      ]
    },
    { id: '25', label: '25', type: 'normal', click: _ => pomo.startPomodoro(25) },
    { id: '15', label: '15', type: 'normal', click: _ => pomo.startPomodoro(15) },
    { id: '5', label: '5', type: 'normal', click: _ => pomo.startPomodoro(5) },
    { id: '-2', label: 'Cancel', type: 'normal', click: _ => pomo.reset(true) },
    { type: 'separator' },
    { id: '-1', label: 'Quit', type: 'normal', click: _ => cleanUpAndQuit() },
  ]);
}