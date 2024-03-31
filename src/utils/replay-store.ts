import {Storage} from './storage';

export class ReplayStore {
    static getReplays(): Array<String> {
        const replaysStr = Storage.get('replays');
        if (replaysStr) {
            try {
                return JSON.parse(replaysStr);
            } catch (error) {
                console.error('Error parsing leaderboard JSON:', error);
                return [];
            }
        }
        return []; 
    }

    // Method to save the leaderboard to cookies
    static setReplays(replays: Array<String>): void {
        try {
            const replaysStr = JSON.stringify(replays);
            Storage.set('replays', replaysStr);
        } catch (error) {
            console.error('Error serializing replays JSON:', error);
        }
    }

    // Method to update the replay array with the last game
    static updateReplays(p1Name: string, p2Name: string, gameString: string): void {
        const replays = this.getReplays();
        console.log(replays)
        if (replays.length >= 30){
            replays.shift();
        }
        let saveString = p1Name + "_" + p2Name + "_" + gameString
        replays.push(saveString)
        this.setReplays(replays);
        console.log(replays)
    }
}