import { Tray, nativeImage, Menu } from 'electron';
/*
  Timr Must be imported like this, or when we transpile it it will convert `Timr(0);` 
  to `timrjs_1.default(0);` which will break things.
*/
import * as Timr from 'timrjs';
import { Alerts } from "./alerts";
import * as path from 'path';

export class PomoEngine {
    private readonly alert: Alerts;
    private readonly tray: Tray;
    private readonly baseDir: string;
    private readonly defaultTrayImg: string;
    private readonly alertTrayImg: string;

    private blinkingMode: boolean = false;

    //I Couldn't get the type of Timr. I had to import it this way
    private timer = null;

    constructor(alert: Alerts, menu: Menu, baseDir: string) {
        this.defaultTrayImg = path.join(baseDir, '/res/tomato.png');
        this.alertTrayImg = path.join(baseDir, '/res/yomato.png');
        this.tray = new Tray(this.defaultTrayImg);
        this.tray.setContextMenu(menu);
        this.tray.on('click', () => this.trayClicked());
        this.timer = Timr(0);

        this.alert = alert;
        this.baseDir = baseDir;
    }

    startPomodoro(minutes: number) {
        let finishedPomodoro = false;
        this.reset();
        this.timer = Timr(minutes * 60);
        this.timer.ticker(({ formattedTime, raw }) => {
            if (this.blinkingMode) {
                this.tray.setImage(raw.currentSeconds % 2 == 0 ? this.alertTrayImg : this.defaultTrayImg)
            } else {
                this.tray.setToolTip(`${minutes} Pomodorino: ${formattedTime} left`);
                if (raw.currentMinutes > 0 && raw.currentSeconds == 59) {
                    this.updateTray(+raw.currentMinutes + 1)
                }
                if (raw.currentMinutes == 0 && raw.currentSeconds != 0) {
                    this.updateTray(+raw.currentSeconds)
                }
            }
        });
        this.timer.finish(() => {
            if (finishedPomodoro) return;
            this.pomodoroFinished(minutes);
            finishedPomodoro = true;
        });
        this.timer.start();
    }

    reset(cancelled: boolean = false) {
        this.blinkingMode = false;
        this.timer.destroy();
        if (cancelled)
            this.tray.setToolTip("Cancelled");
        this.tray.setImage(this.defaultTrayImg);
    }

    //TODO: Maybe create an eventListener here if we ever want to plug something else from outside.
    //example: https://stackoverflow.com/a/40822325/2506478
    private pomodoroFinished(minutes: number) {
        this.tray.setToolTip(`${minutes} Pomodorino finished at ${new Date().toLocaleTimeString()}`);
        if (!this.blinkingMode) this.alert.callAlerts();

        this.blinkingMode = (!this.blinkingMode && this.alert.getShouldBlink());
        if (this.blinkingMode) this.timer.start();

        if (!this.alert.getShouldBlink()) this.reset();
    }

    private updateTray(timeLeft: number) {
        this.generateImage(timeLeft.toString(), (img: string | Electron.NativeImage) => {
            this.tray.setImage(img);
        });
    }

    private generateImage(overlayText, setTrayImageClosure) {
        let useBiggerFonts = (process.platform == "win32")
        let Jimp = require("jimp");
        let fileName = path.join(this.baseDir, '/res/tomato.png');
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

    trayClicked() {
        if (this.blinkingMode) this.reset();
    }
}