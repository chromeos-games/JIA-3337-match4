import { SettingsStore } from './utils/settings-store.ts'
import { BoardModel } from './board-model.ts'
import { gameBoardView } from './game-board.ts'

export class BoardController {
    firstPlayer: string = SettingsStore.firstPlayer
    winPositions: number[][] = []
    win: boolean = false
    currentPlayerDidForfeit: boolean = false
    enableMoves: boolean = true
    currentPlayerID: string = this.firstPlayer
    difficulty: string = SettingsStore.difficulty
    p2IsBot: boolean = SettingsStore.p2IsBot
    // view
    view: gameBoardView
    // board
    board: BoardModel

    constructor(gameBoard: gameBoardView) {
        this.board = new BoardModel()
        this.view = gameBoard
    }

    initBoard() {
        if (SettingsStore.curr_game.length != 0) {
            //Set the correct current player
            if (parseInt(SettingsStore.curr_game[0]) === 0) {
                this.currentPlayerID = "p1"
            } else {
                this.currentPlayerID = "p2"
            }

            for (let i = 1; i < SettingsStore.curr_game.length; i++) {
                if (SettingsStore.curr_game[i] === 'f') {
                    this.currentPlayerDidForfeit = true
                    break
                }
                this.makeMove(parseInt(SettingsStore.curr_game[i]), false) // don't store already stored moves
            }
        } else {
            SettingsStore.curr_game = this.firstPlayer === 'p1' ? '0' : '1'
            if(this.firstPlayer === 'p2' && this.difficulty !== '') {
                // make move when bot goes first, difficulty will be empty if no bot
                this.makeMove(this.getBotMove())
            }
        }
    }
    
    public forfeit(): boolean {
        let botsTurn = this.currentPlayerID === 'p2' && this.difficulty !== ''
        if (this.win || this.currentPlayerDidForfeit || botsTurn) {
            return false
        }
        SettingsStore.curr_game += 'f'
        this.currentPlayerDidForfeit = true
        return true
    }

    public makeMove(col: number, store: boolean = true): boolean {
        if (!this.enableMoves || this.win || this.currentPlayerDidForfeit) {
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
        this.checkGameEnd()
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
        if (SettingsStore.curr_game.length >= 6*7) {
            return -1
        }
        let botMovePosition = this.checkThreeInARow('p2')
        if (botMovePosition !== -1) {
            return botMovePosition
        } else {
            let board = this.board.getBoard()
            let depth = 1
            if (this.difficulty == 'easy') {
                if (Math.random() < .7) {
                    return this.getRandomMove()
                }
                depth = 2
            } else if (this.difficulty == 'medium') {
                if (Math.random() < .4) {
                    return this.getRandomMove()
                }
                depth = 4
            } else if (this.difficulty == 'hard') {
                if (Math.random() < .1) {
                    return this.getRandomMove()
                }
                depth = 5
            } 
            let vals = this.minMaxSolver(board, depth, -99999, 99999, 'p2')
            console.log("move: " + vals[0] + " score: " + vals[1])
            return vals[0]
        }
    }

    private getRandomMove() {
        const moves = this.getValidMoves(this.board.board)
        return moves[Math.floor(Math.random() * moves.length)][1]
    }

    private  calls = 0
    private minMaxSolver(board: string[][], depth: number, alpha: number, beta: number, player: string): [number, number] {
        //Check for base case or terminating conditions
        this.calls += 1
        const winner = this.checkWinningNode(board)
        if (winner !== '') {
            if (winner === 'p1') {
                return [-1, -99999]
            }
            else if (winner === 'p2'){
                return [-1, 99999]
            }
        }
        if (depth === 0){
            return [-1, this.scorePosition(board, player)]
        }
        //Draw case
        let validMoves = this.getValidMoves(board)
        if (validMoves.length === 0) {
            return [-1, 0]
        }
        //Maximization (BOT)
        if (player==='p2'){
            let max_score = -9999999
            let selectedCol = 3 //Default to center column. Could randomize instead
            for (let i = 0; i < validMoves.length; i++){
                let newBoard = JSON.parse(JSON.stringify(board))
                let row = validMoves[i][0]
                let col = validMoves[i][1]
                newBoard[row][col] = 'p2'
                let new_score = this.minMaxSolver(newBoard, depth-1, alpha, beta, 'p1')[1]
                if (new_score > max_score) {
                    max_score = new_score
                    selectedCol = col
                }
                alpha = Math.max(alpha, max_score)
                if (beta <= alpha) {
                    break
                }
            }
            return [selectedCol, max_score]
        }
        //Minimization (PLAYER)
        else {
            let min_score = 9999999
            let selectedCol = 3
            for (let i = 0; i < validMoves.length; i++) {
                let newBoard = JSON.parse(JSON.stringify(board))
                let row = validMoves[i][0]
                let col = validMoves[i][1]
                newBoard[row][col] = 'p1'
                let new_score = this.minMaxSolver(newBoard, depth-1, alpha, beta, 'p2')[1]
                if (new_score < min_score) {
                    min_score = new_score
                    selectedCol = col
                }
                beta = Math.min(beta, min_score)
                if (beta <= alpha) {
                    break
                }
            }
            return [selectedCol, min_score]
        }
    }
    private getValidMoves(board: string[][]) {
        const validMoves = []
        for (let col = 0; col < 7; col++){
            let row = this.checkValidColumn(board, col)
            if (row >= 0){
                validMoves.push([row, col])
            }
        }
        return validMoves
    }
    public checkValidColumn(board: string[][], col: number) {
        //if the column is valid, return the row the token falls into
        for (let row = 5; row >= 0; row--) {
            if (!board[row][col]) {
                return row
            }
        }
        return -1 // Column is full
    }
    //the code could be made more efficent by having this function end the game, but it would require changes to the overall flow of the code
    private checkThreeInARow(player: string): number{
        //check if we can get 4 in a row
        //this must be the 7th or higher move
        if (SettingsStore.curr_game.length >= 7) {
            for (let row = 0; row < 6; row++) {
                for (let col = 0; col < 7; col++) {
                    if (this.board.getSquare(row, col)) {
                        if (this.board.getSquare(row, col) === player) {
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
    /**
     * Returns the winning player. Returns '' if no winner
     */
    private checkWinningNode(board: string[][]): string{
        //Horizontal
        for (let col = 0; col < 7-3; col++){
            for (let row = 0; row < 6; row++){
                let player = board[row][col]
                if (player === board[row][col + 1] && player === board[row][col + 2] && player === board[row][col + 3]) {
                    return player
                }
            }
        }
        //Vertical
        for (let col = 0; col < 7; col++){
            for (let row = 0; row < 6-3; row++){
                let player = board[row][col]
                if (player === board[row+1][col] && player === board[row+2][col] && player === board[row+3][col]) {
                    return player
                }
            }
        }
        //Diags
        for (let col = 0; col < 7-3; col++){
            for (let row = 0; row < 6-3; row++){
                let player = board[row][col]
                if (player === board[row+1][col+1] && player === board[row+2][col+2] && player === board[row+3][col+3]) {
                    return player
                }
            }
        }
        for (let col = 0; col < 7-3; col++){
            for (let row = 3; row < 6; row++){
                let player = board[row][col]
                if (player === board[row-1][col+1] && player === board[row-2][col+2] && player === board[row-3][col+3]) {
                    return player
                }
            }
        }
        return ''
    }
    private scorePosition(board: string[][], player: string){
        var score = 0
        const COLUMN_COUNT = board[0].length
        const ROW_COUNT = board.length
        const WINDOW_LENGTH = 4
        //Center column pieces are generally strong
        const center = board[Math.floor(COLUMN_COUNT/2)]
        score += this.getPlayerOccurrences(center, player) * 3
        //Score horizontal positions
        for (let r = 0; r < ROW_COUNT; r++){
            const row = board[r]
            for (let c = 0; c < COLUMN_COUNT - 3; c++){
                score += this.evaluateWindow(row.slice(c, c+WINDOW_LENGTH), player)
            }
        }
        //Score vertical positions
        for (let c = 0; c < COLUMN_COUNT; c++){
            //Javascript isn't Python pain
            const col = board.map(x => x[c])
            for (let r = 0; r < ROW_COUNT - 3; r++){
                score += this.evaluateWindow(col.slice(r, r+WINDOW_LENGTH), player)
            }
        }
        //Score positive diagonals
        for (let r = 0; r < ROW_COUNT - 3; r++){
            for (let c = 0; c < COLUMN_COUNT - 3; c++){
                const window = []
                for (let i = 0; i < WINDOW_LENGTH; i++){
                    window.push(board[r+i][c+i])
                }
                score += this.evaluateWindow(window, player)
            }
        }
        //Score negative diagonals
        for (let r = 0; r < ROW_COUNT - 3; r++){
            for (let c = 0; c < COLUMN_COUNT - 3; c++){
                const window = []
                for (let i = 0; i < WINDOW_LENGTH; i++){
                    window.push(board[r+3-i][c+i])
                }
                score += this.evaluateWindow(window, player)
            }
        }
        return score
    }

    private evaluateWindow(window: string[], player: string): number{
        var score = 0
        //Switch scoring based on turn
        const opp_player = player === 'p1' ? 'p2' : 'p1'
        //Prioritise a winning move
        if (this.getPlayerOccurrences(window, player)===4) {
            score+=1000000
        }
        else if (this.getPlayerOccurrences(window, player)===3 && 
                    this.getPlayerOccurrences(window, '')===1) {
            score+=5
        }
        else if (this.getPlayerOccurrences(window, player)===2 && 
        this.getPlayerOccurrences(window, '')===2) {
            score+=2
        } 
        if (this.getPlayerOccurrences(window, opp_player)===4){
            score-=1000000
        }
        //Reduce the score if there's a win possibility for the opponent
        else if (this.getPlayerOccurrences(window, opp_player)===3 && 
                this.getPlayerOccurrences(window, '')===1) {
            score-=5
        }
        return player === 'p2' ? score : -score
    }

    private getPlayerOccurrences(array: string[], value: any) {
        return array.filter((v) => (v === value)).length;
    }

    private checkGameEnd() {
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
        } else {
            //if the board is full and there is no winner, it's a draw
            if (this.board.move_num >= 42){
                this.win = true
                this.view.onDraw(this.winPositions)
            }
        }
    }
}