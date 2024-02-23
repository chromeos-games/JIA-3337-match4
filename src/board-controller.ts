import { SettingsStore } from './utils/settings-store.ts'
import { BoardModel } from './board-model.ts'
import { gameBoardView } from './game-board.ts'

export class BoardController {
    firstPlayer: string = SettingsStore.firstPlayer
    winPositions: number[][] = []
    win: boolean = false
    enableMoves: boolean = true
    currentPlayerID: string = this.firstPlayer
    // view
    view: gameBoardView
    // board
    board: BoardModel

    constructor(gameBoard: gameBoardView) {
        this.board = new BoardModel()
        this.view = gameBoard
        this.initBoard()
    }

    initBoard() {
        if (SettingsStore.curr_game.length != 0) {
            console.log('loading previous game')
            //Set the correct current player
            if (parseInt(SettingsStore.curr_game[0]) === 0) {
                this.currentPlayerID = "p1"
            } else {
                this.currentPlayerID = "p2"
            }

            for (let i = 1; i < SettingsStore.curr_game.length; i++) {
                this.makeMove(parseInt(SettingsStore.curr_game[i]), false) // don't store already stored moves
            }
        } else {
            SettingsStore.curr_game = this.firstPlayer === 'p1' ? '0' : '1'
        }
    }

    public makeMove(col: number, store: boolean = true): boolean {
        if (!this.enableMoves || this.win) {
            console.log("Moves are disabled")
            return false;
        }
        const row = this.board.checkValidColumn(col);
        if (row === -1) {
            return false;
        }
        this.enableMoves = false;
        this.view.onMovesEnabledChanged(false);
        this.board.setSquare(row, col, this.currentPlayerID)
        if (store) {
            SettingsStore.curr_game += col.toString()
        }
        this.view.onMove(row, col, this.currentPlayerID)
        this.checkWinner()
        if (this.win) {
            return true
        }
        this.enableMoves = true;
        this.view.onMovesEnabledChanged(true);
        if (this.currentPlayerID === "p1") {
            this.currentPlayerID = "p2"
        } else {
            this.currentPlayerID = "p1"
        }
        return true
    }

    public getBotMove(): number {
        let botMovePosition = -1
        //first check if we can get 4 in a row
        //this must be the 7th or higher move
        if (SettingsStore.curr_game.length >= 7) {
            for (let row = 0; row < 6; row++) {
                for (let col = 0; col < 7; col++) {
                    if (this.board.getSquare(row, col)) {
                        let bot = this.board.getSquare(row, col)
                        //we start in the top left which means we only need to check right, down, and diagonally right and left
                        if (bot === this.board.getSquare(row, col + 1) && bot === this.board.getSquare(row, col + 2)) {
                            //potential win, check for blocking. If the square is null bot can win
                            if(!this.board.getSquare(row, col + 3)){
                                return col + 3
                            }
                        } else if (bot === this.board.getSquare(row + 1, col) && bot === this.board.getSquare(row + 2, col)) {
                            if(!this.board.getSquare(row + 3, col)){
                                return col
                            }
                        } else if (bot === this.board.getSquare(row + 1, col + 1) && bot === this.board.getSquare(row + 2, col + 2)) {
                            if (!this.board.getSquare(row + 3, col + 3)){
                                return col + 3
                            }
                        } else if (bot === this.board.getSquare(row + 1, col - 1) && bot === this.board.getSquare(row + 2, col - 2)) {
                            if (!this.board.getSquare(row + 3, col - 3)){
                                return col - 3
                            }
                        }
                    }
                }
            }
          
        }
        if (botMovePosition === -1) {
            return 2
        } else {
            return botMovePosition
        }
    }


    private checkWinner() {
        //tokens are stored as colors
        for (let row = 0; row < 6; row++) {
            for (let col = 0; col < 7; col++) {
                if (this.board.getSquare(row, col)) {
                    let player = this.board.getSquare(row, col)
                    //we start in the top left which means we only need to check right, down, and diagonally right and left
                    if (player === this.board.getSquare(row, col + 1) && player === this.board.getSquare(row, col + 2) && player === this.board.getSquare(row, col + 3)) {
                        for (let i = 0; i < 4; i++) {
                            this.winPositions.push([row, col + i])
                        }
                    } else if (player === this.board.getSquare(row + 1, col) && player === this.board.getSquare(row + 2, col) && player === this.board.getSquare(row + 3, col)) {
                        for (let i = 0; i < 4; i++) {
                            this.winPositions.push([row + i, col])
                        }
                    } else if (player === this.board.getSquare(row + 1, col + 1) && player === this.board.getSquare(row + 2, col + 2) && player === this.board.getSquare(row + 3, col + 3)) {
                        for (let i = 0; i < 4; i++) {
                            this.winPositions.push([row + i, col + i])
                        }
                    } else if (player === this.board.getSquare(row + 1, col - 1) && player === this.board.getSquare(row + 2, col - 2) && player === this.board.getSquare(row + 3, col - 3)) {
                        for (let i = 0; i < 4; i++) {
                            this.winPositions.push([row + i, col - i])
                        }
                    }
                }
            }
        }
        if (this.winPositions.length != 0) {
            this.win = true
            this.view.onWin(this.winPositions)
        }
    }
}