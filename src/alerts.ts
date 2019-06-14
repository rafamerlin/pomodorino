import * as notifier from 'node-notifier'

export class Alerts {
    shouldPlayAudio: boolean = true;
    shouldNotify: boolean = true;
    // shouldBlink: boolean = true;
    readonly renderer: Electron.BrowserWindow = null;
    readonly audioFile: string; 
    readonly notificationIcon: string;

    constructor(renderer: Electron.BrowserWindow, baseDir: string) {
        this.renderer = renderer;
        this.audioFile = `${baseDir}/res/audio/ring-fixed-bitrate.mp3`;
        this.notificationIcon = `${baseDir}/res/tomato.png`;
    }

    configurePlayAudio(onOff: boolean) {
        this.shouldPlayAudio = onOff;
    }

    configureNotification(onOff: boolean) {
        this.shouldNotify = onOff;
    }

    // configureBlinking(onOff: boolean){
    //     this.shouldBlink = onOff;
    // }

    playAudio(){
        if (!this.shouldPlayAudio) return;

        let AudioConfig = {
            source: this.audioFile
        };
        
        this.renderer.webContents.send('play-audio', AudioConfig);
    }

    notify(){
        if (!this.shouldNotify) return;

        notifier.notify({
            'title': 'Pomodorino',
            'message': 'Your pomodoro has finished',
            'icon': this.notificationIcon,
            wait: true
        });
    }

    // blink(){
    //     if (!this.shouldBlink) return;

    // }
}