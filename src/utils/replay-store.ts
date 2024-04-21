import {Storage} from './storage';

export class ReplayStore {
    static getReplays(): Array<Array<String>> {
        const replaysStr = Storage.get('replays');
        if (replaysStr) {
            try {
                return JSON.parse(replaysStr) as string[][];
            } catch (error) {
                console.error('Error parsing leaderboard:', error);
                return [];
            }
        }
        return []; 
    }

    // Method to save the leaderboard to cookies
    static setReplays(replays: Array<Array<String>>): void {
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
        if (replays.length >= 30){
            replays.shift();
        }
        let saveString = [p1Name , p2Name , gameString]
        replays.push(saveString)
        this.setReplays(replays);
        console.log(replays)
    }
    static resetReplays(): void {
        const replays = new Array<Array<String>>();
        this.setReplays(replays);
    }
}