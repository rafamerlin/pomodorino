### Pomodorino (very simple task bar pomodoro)
I started developing this app to learn a bit about Electron. 

Pomodorino is the diminutive of pomodoro (so it would be equivalent to Cherry Tomato). My idea with this app is to make the simplest possible Pomorodoapp possible, so it has no interface besides the Tray icon and its context menu.

It is recommended to check the technique in more details on the [official website](https://cirillocompany.de/pages/pomodoro-technique)

#### I want to add more or change the timers:
Just search on `main.js` for `{ id: '25', label: '25', type: 'normal', click: menuClick },`
This is the line that adds the 25 mins timer. You just add more or remove them. What is used as the time is the id field, so you an change the label for anything you need to.

#### Building for use:
First we clone this repo and install all of its dependencies:
`npm install`

Then we install the electron-packager:
`npm install electron-packager -g`

And we run on Pomodorino's source folder the following:
`electron-packager .` 

It will create a folder with all the necessary file (you can move this folder to where you want it). If you're running it on Windows, check the Troubleshoot session.

#### Troubleshoot for Windows:
In case the audio fails to play on Windows, you need to download mplayer.exe and add it to the same folder of the application executable file. (I got mine on [https://sourceforge.net/projects/mplayerwin/](https://sourceforge.net/projects/mplayerwin/))

After the package generation, find mplayer inside the `resources/app` folder and move it to the same folder as `Pomodorino.exe` so it will work.

#### Where I want this app to get to:
I intend to generate a proper release for it, as the installation process I managed to do here is not good enough yet. I still have to learn more about Electron to be able to achieve these goals.

This app was tested on Manjaro Linux XFCE and Windows 8.1 (for windows I needed the troubleshoot), hopefully it will work fine on Mac OS and other Linux distros as well.

#### Credits:
- Tomato Icon: [Designed by Freepik](http://www.freepik.com/free-vector/delicious-ingredients-for-pizza_921351.htm)
- Audio: [From FreeSound.org](https://www.freesound.org/s/167337/)

#### Disclaimer:
Pomodoro Technique® and Pomodoro™ are registered and filed trademarks owned by Francesco Cirillo. Pomodorino is not affiliated by, associated with nor endorsed by Francesco Cirillo.
