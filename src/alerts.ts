export class Alerts {
    shouldPlayAudio: boolean = true;
    // shouldBlink: boolean = true;
    readonly renderer: Electron.BrowserWindow = null;
    readonly audioFile: string; 

    constructor(renderer: Electron.BrowserWindow, audioFile: string) {
        this.renderer = renderer;
        this.audioFile = audioFile;
    }

    configurePlayAudio(onOff: boolean) {
        this.shouldPlayAudio = onOff;
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

    // blink(){
    //     if (!this.shouldBlink) return;

    // }
}