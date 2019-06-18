import * as notifier from 'node-notifier'

export class Alerts {
    private alertMode = false;
    shouldBlink : boolean = true;
    shouldPlayAudio: boolean = true;
    shouldNotify: boolean = true;

    readonly renderer: Electron.BrowserWindow = null;
    readonly audioFile: string; 
    readonly notificationIcon: string;

    constructor(renderer: Electron.BrowserWindow, baseDir: string) {
        this.renderer = renderer;
        this.audioFile = `${baseDir}/res/audio/ring-fixed-bitrate.mp3`;
        this.notificationIcon = `${baseDir}/res/tomato.png`;
    }

    configureBlinking(onOff : boolean){
        this.shouldBlink = onOff;
    }

    configurePlayAudio(onOff: boolean) {
        this.shouldPlayAudio = onOff;
    }

    configureNotification(onOff: boolean) {
        this.shouldNotify = onOff;
    }

    setAlertMode(onOff: boolean) {
        this.alertMode = onOff;
    }

    getAlertMode(){
        // if (!this.shouldBlink) return false;
        
        return this.alertMode;
    }

    callAlerts(){
        this.playAudio();
        this.notify();
        this.setAlertMode(true);
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