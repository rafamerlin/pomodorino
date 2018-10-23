(function () {

    const { ipcRenderer } = require('electron');
    const { Howl, Howler } = require('howler');

    ipcRenderer.on("play-audio", (event, args) => {
        console.log(args);

        var sound = new Howl({
            src: [args.source]
        }).play();
    })
})()