(function () {

    const { ipcRenderer } = require('electron');
    const { Howl } = require('howler');

    ipcRenderer.on("play-audio", (_event, args) => {
        new Howl({
            src: [args.source]
        }).play();
    })
})()