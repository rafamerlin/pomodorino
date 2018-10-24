(function () {

    const { ipcRenderer } = require('electron');
    const { Howl, Howler } = require('howler');

    ipcRenderer.on("play-audio", (event, args) => {
        var sound = new Howl({
            src: [args.source]
        }).play();
    })
})()