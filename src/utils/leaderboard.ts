import {Storage} from './storage';

export class Leaderboard {
    static getLeaderboard(): Record<string, { totalGamesPlayed: number; gamesWon: number }> {
        const leaderboardStr = Storage.get('leaderboard');
        if (leaderboardStr) {
            try {
                
                return JSON.parse(leaderboardStr);
            } catch (error) {
                
                console.error('Error parsing leaderboard JSON:', error);
                return {};
            }
        }
        return {}; 
    }

    // Method to save the leaderboard to cookies
    static setLeaderboard(leaderboard: Record<string, { totalGamesPlayed: number; gamesWon: number }>): void {
        try {
            
            const leaderboardStr = JSON.stringify(leaderboard);
            Storage.set('leaderboard', leaderboardStr);
        } catch (error) {
            console.error('Error serializing leaderboard JSON:', error);
        }
    }

    // Method to update the leaderboard with new game results
    static updateLeaderboard(winnerName: string, loserName: string): void {
        const leaderboard = this.getLeaderboard();

        
        if (!leaderboard[winnerName]) {
            leaderboard[winnerName] = { totalGamesPlayed: 0, gamesWon: 0 };
        }
        leaderboard[winnerName].totalGamesPlayed += 1;
        leaderboard[winnerName].gamesWon += 1;

       
        if (!leaderboard[loserName]) {
            leaderboard[loserName] = { totalGamesPlayed: 0, gamesWon: 0 };
        }
        leaderboard[loserName].totalGamesPlayed += 1;
        

        
        this.setLeaderboard(leaderboard);
    }
}
