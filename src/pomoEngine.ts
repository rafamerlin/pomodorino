/*
  Timr Must be imported like this, or when we transpile it it will convert `Timr(0);` 
  to `timrjs_1.default(0);` which will break things.
*/
import * as Timr from 'timrjs';

import { Alerts } from "./alerts";
import { Tray, nativeImage } from 'electron';

export class PomoEngine {
    private readonly alert: Alerts;
    private readonly tray: Tray;
    private readonly baseDir: string;
    private readonly defaultTrayImg : string;

    //I Couldn't get the type of Timr. I had to import it this way
    private timer = null;
        
    constructor(alert: Alerts, tray: Tray, baseDir: string) {
        this.alert = alert;
        this.tray = tray;
        this.baseDir = baseDir;
        
        this.timer = Timr(0);
        //TODO: Move this to our new implementation of the Tray class later.
        //This is duplicated for now.
        this.defaultTrayImg = `${baseDir}/res/tomato.png`
    }

    startPomodoro(minutes: number) {
        this.timer.destroy();
        this.timer = Timr(minutes * 1);
        this.timer.ticker(({ formattedTime, raw }) => {
            this.tray.setToolTip(`Pomodorino: ${formattedTime} left`);
            if (raw.currentMinutes > 0 && raw.currentSeconds == 59) {
                this.updateTray(+raw.currentMinutes + 1)
            }
            if (raw.currentMinutes == 0 && raw.currentSeconds != 0) {
                this.updateTray(+raw.currentSeconds)
            }
        });
        this.timer.finish(() => {
            this.pomodoroFinished(minutes);    
        });
        this.timer.start();
    }

    reset() {
        this.timer.destroy();
        this.tray.setToolTip('Pomodorino by Merurino');
        this.tray.setImage(this.defaultTrayImg);
    }


    //TODO: Maybe create an eventListener here if we ever want to plug something else from outside.
    //example: https://stackoverflow.com/a/40822325/2506478
    private pomodoroFinished(minutes: number){
        this.reset();
        this.alert.callAlerts();
    }

    private updateTray(timeLeft: number) {
        this.generateImage(timeLeft.toString(), (img: string | Electron.NativeImage) => {
            this.tray.setImage(img);
        });
    }

    private generateImage(overlayText, setTrayImageClosure) {
        let useBiggerFonts = (process.platform == "win32")
        let Jimp = require("jimp");
        let fileName = `${this.baseDir}/res/tomato.png`;
        let calculatedY = useBiggerFonts ? 0 : 8
        let calculatedX = useBiggerFonts ?
          (overlayText.length > 1) ? 0 : 8
          : (overlayText.length > 1) ? 8 : 12
      
        let loadedImage = null
        Jimp.read(fileName)
          .then(function (image: any) {
            loadedImage = image;
            return Jimp.loadFont(useBiggerFonts ? Jimp.FONT_SANS_32_BLACK : Jimp.FONT_SANS_16_BLACK);
          })
          .then(function (font: any) {
            loadedImage.print(font, calculatedX, calculatedY, overlayText)
              .getBuffer(Jimp.AUTO, function (err: any, src: Buffer) {
                let bufferedImage = nativeImage.createFromBuffer(src);
                setTrayImageClosure(bufferedImage);
              });
          });
      }

}