const remote = require('electron').remote
const main = remote.require('./main.js')

let button = document.createElement('button')
button.textContent = 'Open Window'
button.addEventListener('click', () => {
    main.openWindow()
    main.playAlarm();
}, false)
document.body.appendChild(button)  