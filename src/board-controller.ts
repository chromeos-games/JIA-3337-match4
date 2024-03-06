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
        this.board.move_num += 1
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
        //if the board is full, the game is a draw
        //need to add a function to deal with a draw somewhere else, right now the game just goes on forever
        if (SettingsStore.curr_game.length >= 6*7) {
            return -1
        }
        let botMovePosition = this.checkThreeInARow()
        if (botMovePosition !== -1) {
            return botMovePosition
        } else {
            let bestScore = -100
            for (let row = 0; row < 6; row++) {
                for (let col = 0; col < 7; col++) {
                    if (this.board.getSquare(row, col)) {
                        if (this.board.getSquare(row, col) === 'p2') {
                            let score = this.minMaxSolver(row, col)[0]
                            let column = this.minMaxSolver(row, col)[1]
                            //this is set up assuming the bot will take the most positive score. It could still be negative if there are no good moves to play.
                            if (score > bestScore) {
                                return column
                            }
                        }               
                    }
                }
            }
            return botMovePosition
        }


    }

    private minMaxSolver(row: number, col: number): [number, number]{
        let exploredPosition = this.minMaxSolverHelper(row, col, 0, 0)
        return exploredPosition
    }

    private minMaxSolverHelper(row: number, col: number, depth: number, score: number) : [number, number]{
        if (depth >= 4) {
            return [score, col]
        }
        depth = depth + 1
        //TODO
        //implement the AI here. The bot will try to maximize the score, and will assume the player is minimizing the score
        this.minMaxSolverHelper(row, col, depth, score)
        return [score, col]

    }
    //the code could be made more efficent by having this function end the game, but it would require changes to the overall flow of the code
    private checkThreeInARow(): number{
        //check if we can get 4 in a row
        //this must be the 7th or higher move
        if (SettingsStore.curr_game.length >= 7) {
            for (let row = 0; row < 6; row++) {
                for (let col = 0; col < 7; col++) {
                    if (this.board.getSquare(row, col)) {
                        if (this.board.getSquare(row, col) === 'p2') {
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
        }
        return -1
    }

    private checkWinner() {
        //draw check
        if (this.board.move_num >= 42){
            this.win = true
            this.view.onDraw(this.winPositions)
        }
        
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