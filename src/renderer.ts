// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

import { ipcRenderer } from 'electron';
import { Howl } from 'howler';

ipcRenderer.on("play-audio", (_event: any, args: { source: any; }) => {
    new Howl({
        src: [args.source]
    }).play();
});