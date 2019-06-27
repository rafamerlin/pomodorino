import {Notification} from "electron"
import * as path from 'path';


export class Alerts {
    shouldBlink: boolean = true;
    shouldPlayAudio: boolean = true;
    shouldNotify: boolean = true;

    readonly renderer: Electron.BrowserWindow = null;
    readonly audioFile: string; 
    readonly notificationIcon: string;

    constructor(renderer: Electron.BrowserWindow, baseDir: string) {
        this.renderer = renderer;
        this.audioFile = path.join(baseDir, '/res/audio/ring-fixed-bitrate.mp3');
        this.notificationIcon = path.join(baseDir,'/res/tomato.png');
    }

    configurePlayAudio(onOff: boolean) {
        this.shouldPlayAudio = onOff;
    }

    configureNotification(onOff: boolean) {
        this.shouldNotify = onOff;
    }

    configureBlinking(onOff: boolean) {
        this.shouldBlink = onOff;
    }

    getShouldBlink(){
        return this.shouldBlink;
    }

    callAlerts(){
        this.playAudio();
        this.notify();
    }

    private playAudio(){
        if (!this.shouldPlayAudio) return;

        let AudioConfig = {
            source: this.audioFile
        };
        
        this.renderer.webContents.send('play-audio', AudioConfig);
    }

    private notify(){
        if (!this.shouldNotify) return;

        let n = new Notification({
            silent: true,
            title: "Pomodorino",
            body: "Your pomodoro has finished",
            icon: this.notificationIcon
        });
        
        n.show();
    }
}