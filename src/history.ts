import * as jetpack from "fs-jetpack";

export class Log {
    public LogStart(minutes: number) {
        this.AddEntry(`${minutes} Pomodoro Started`);
    }

    public LogFinish(minutes: number) {
        this.AddEntry(`${minutes} Pomodoro Finished`);
    }

    public LogCancelled() {
        this.AddEntry("Pomodoro Cancelled");
    }

    private AddEntry(message: string) {
        const timeStamp = `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`;
        const historyMessage = `${timeStamp} : ${message}`;
        
        // toLocaleDateString will default to en-US always in Electron:
        // Open Bug: https://github.com/electron/electron/issues/13023
        jetpack.appendAsync("history.txt", historyMessage + '\n');
    }
}