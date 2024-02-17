export class BoardModel {
    board: string[][];
    constructor() {
        this.board = Array.from({ length: 6 }, () => Array(7).fill(null))
    }

    public setRow(row: number, col: number, value: string) {
        this.board[row][col] = value
    }

    public findAvailableRow(col: number): number {
        for (let row = 5; row >= 0; row--) {
            if (!this.board[row][col]) {
                return row
            }
        }
        return -1 // Column is full
    }

    public getRow(row: number, col: number) {
        if (row < 0 || row >= this.board.length) {
            return "Invalid"
        }
        if (col < 0 || col >= this.board[0].length) {
            return "Invalid"
        }
        return this.board[row][col]
    }
}