import {Storage} from './storage';

export class Leaderboard {
    static getLeaderboard(): Record<string, { totalGamesPlayed: number; gamesWon: number }> {
        const leaderboardStr = Storage.get('leaderboard');
        if (leaderboardStr) {
            try {
                // Parse the JSON string back into an object
                return JSON.parse(leaderboardStr);
            } catch (error) {
                // Log and return an empty object in case of error
                console.error('Error parsing leaderboard JSON:', error);
                return {};
            }
        }
        return {}; // Return an empty object if no leaderboard data is found
    }

    // Method to save the leaderboard to cookies
    static setLeaderboard(leaderboard: Record<string, { totalGamesPlayed: number; gamesWon: number }>): void {
        try {
            // Convert the leaderboard object to a JSON string
            const leaderboardStr = JSON.stringify(leaderboard);
            Storage.set('leaderboard', leaderboardStr);
        } catch (error) {
            console.error('Error serializing leaderboard JSON:', error);
        }
    }

    // Method to update the leaderboard with new game results
    static updateLeaderboard(winnerName: string, loserName: string): void {
        const leaderboard = this.getLeaderboard();

        // Update the winner's record
        if (!leaderboard[winnerName]) {
            leaderboard[winnerName] = { totalGamesPlayed: 0, gamesWon: 0 };
        }
        leaderboard[winnerName].totalGamesPlayed += 1;
        leaderboard[winnerName].gamesWon += 1;

        // Update the loser's record
        if (!leaderboard[loserName]) {
            leaderboard[loserName] = { totalGamesPlayed: 0, gamesWon: 0 };
        }
        leaderboard[loserName].totalGamesPlayed += 1;
        // Note: We don't increment gamesWon for the loser

        // Save the updated leaderboard back to cookies
        this.setLeaderboard(leaderboard);
    }
}