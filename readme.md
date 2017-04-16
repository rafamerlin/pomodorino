### Pomodorino (very simple taskbar pomodoro)

#### Building for use:
First we clone this repo and install all of its dependencies:
`npm intall`

Then we install the electron-packager:
`npm install electron-packager -g`

And we run on Pomodorino's source folder the following:
`electron-packager .` 

It will create a folder with all the necessary file (you can move this folder to where you want it). If you're running it on Windows, check the Troubleshoot session.

#### Troubleshoot for Windows:
In case the audio fails to play on Windows, you need to download mplayer.exe and add it to the same folder of the application executable file. (I got mine on [https://sourceforge.net/projects/mplayerwin/](https://sourceforge.net/projects/mplayerwin/))

After the package generation, find mplayer inside the `resources/app` folder and move it to the same folder as `Pomodorino.exe` so it will work.


#### Credits:
- Tomato Icon: [Designed by Freepik](http://www.freepik.com/free-vector/delicious-ingredients-for-pizza_921351.htm)
- Audio: 