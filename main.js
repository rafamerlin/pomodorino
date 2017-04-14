//Example from: https://www.youtube.com/watch?v=jKzBJAowmGg

const electron = require('electron');
const {app, BrowserWindow, Menu, Tray} = electron;


app.on('ready', () => {
    let win = new BrowserWindow({width:800, height:600});
    win.loadURL(`file://${__dirname}/index.html`);
    win.webContents.openDevTools();   
});

exports.openWindow = () =>
{
    let win = new BrowserWindow({width:400, height:200});
    win.loadURL(`file://${__dirname}/bear.html`);

}

let tray = null
app.on('ready', () => {
  tray = new Tray(`${__dirname}/res/tomato.png`)
  const contextMenu = Menu.buildFromTemplate([
    {label: 'Item1', type: 'radio'},
    {label: 'Item2', type: 'radio'},
    {label: 'Item3', type: 'radio', checked: true},
    {label: 'Item4', type: 'radio'}
  ])
  tray.setToolTip('This is my application.')
  tray.setContextMenu(contextMenu)
})

