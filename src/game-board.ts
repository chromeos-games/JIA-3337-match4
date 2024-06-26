import { customElement, property } from 'lit/decorators.js'
import { LitElement, html, css } from 'lit'
import { playSound } from './main-menu.ts'
import { SettingsStore } from './utils/settings-store.ts'
import { BoardController } from './board-controller.ts'
import { ReplayStore } from './utils/replay-store.ts'
import { Leaderboard } from './utils/leaderboard-store.ts'
import buttonwav from '../button.wav'
import tokenwav from '../token.wav'
@customElement('game-board')
export class gameBoardView extends LitElement {

  @property({ type: Boolean }) enableMoves: boolean = true
  @property({ type: Boolean }) botMoving: boolean = false
  @property({ type: Boolean }) eventListenerAdded: boolean = false
  @property({ type: Boolean }) win: boolean = false
  @property({ type: Boolean }) currentPlayerDidForfeit: boolean = false
  @property({ type: Boolean }) pause: boolean = false
  @property({ type: Array }) winPositions: number[][] = []
  @property({ type: Boolean }) displayWin: boolean = false
  @property({ type: Boolean }) displayDraw: boolean = false
  @property({ type: BoardController }) boardController
  @property({ type: Array }) viewBoard: string[][] = []
  @property({ type: Number}) columnHoverIndex: number = -1;

  gameScale: number = SettingsStore.scale

  player1Color: string = SettingsStore.player1TokenColor
  player2Color: string = SettingsStore.player2TokenColor

  connectedCallback() {
    super.connectedCallback()
    playSound(buttonwav)
  }

  constructor() {
    super()
    this.viewBoard = Array.from({ length: 6 }, () => Array(7).fill(null))
    this.boardController = new BoardController(this)
    this.boardController.initBoard()
    if (this.boardController.currentPlayerDidForfeit) {
      this.currentPlayerDidForfeit = true
    }
  }

  render() {
    return html`
    <div style="--game-scale: ${this.gameScale}; transform: scale(var(--game-scale));">
      <h1>Match 4${this.displayWin ? null : " - "} <span style = "color:${this.getColorForPlayer(this.boardController.currentPlayerID)}"> ${this.getNameOfPlayer(this.boardController.currentPlayerID)}'s</span> turn</h1>
      <div class="board">
        ${this.viewBoard.map((row, rowIndex) =>
      row.map((player, colIndex) =>
        html`
              <div class="cell ${this.winFrames(rowIndex, colIndex)}" 
              @click=${() => this.handleCellClick(colIndex)}
              @mouseenter=${() => this.handleColumnHover(colIndex)}
              @mouseleave=${this.handleColumnHoverEnd}>
                ${this.getColorForPlayer(player)
            ? html`<div class="token" style="background-color: ${this.getColorForPlayer(player)}; --rowIndex: ${rowIndex};"></div>`
            : null
          }
          ${this.columnHoverIndex == colIndex && (player == null) && (rowIndex == 5 || this.boardController.board.board[rowIndex + 1][colIndex] !== "") ?
            html`
            <div class="token"
                style="opacity:${this.botMoving ? 0 : .3}; background-color: ${this.getColorForPlayer(this.boardController.currentPlayerID)};
                        --rowIndex: ${rowIndex}; animation: null;">
            </div>` : null
        } 
              </div>
            `
      )
    )}
      </div>
      <div class="${this.shouldShowWinWindow() ? 'winHolder' : 'hidden'}">
          <div class ="${this.shouldShowWinWindow() ? 'winWindow' : 'hidden'}">
            <h2>${this.getWinningMessage()}</h2>
            <button @click=${this.onClickMainMenu} style="position:absolute; right: 10px; bottom: 10px">Main Menu</button>
            <button @click=${this.onClickBack} style="position:absolute; left: 10px; bottom: 10px">Replay</button>
          </div>
      </div>
      <div class="${this.pause ? 'winHolder' : 'hidden'}">
          <div class="${this.pause ? 'pauseWindow' : 'hidden'}">
            <h2 style="margin-bottom: 0px">Game Paused</h2>
            <p >Clicking Main Menu will save the game and return you to the main menu.</p>
            <button @click=${this.onClickMainMenu} style="position:absolute; right: 70px; bottom: 0px;">Main Menu</button>
            <button @click=${this.togglePause} style="position:absolute; left: 70px; bottom: 0px;">Resume</button>
          </div>
      </div>
      <button @click=${this.togglePause} style="${this.shouldHideButtons() ? "visibility: hidden;" : null}">Pause</button>
      <button @click=${this.onClickForfeit} style="${this.shouldHideButtons() ? "visibility: hidden;" : null}">Forfeit</button>
    </div>
  `
  }

  private handleColumnHover(columnIndex: number) {
    if (this.win || this.shouldHideButtons()) {
        this.handleColumnHoverEnd()
    } else {
        this.columnHoverIndex = columnIndex;
    }
  }

  private handleColumnHoverEnd() {
    this.columnHoverIndex = -1;
  }

  shouldShowWinWindow() {
    return this.displayWin || this.displayDraw || this.currentPlayerDidForfeit
  }
  shouldHideButtons() {
    return this.shouldShowWinWindow() || this.pause 
  }

  private getWinningMessage() {
    if (this.displayWin) {
      return html`<span style="color:${this.getColorForPlayer(this.boardController.currentPlayerID)}"> ${this.getNameOfPlayer(this.boardController.currentPlayerID)}</span> Wins!`
    } else if (this.displayDraw) {
      return "Draw!"
    } else if (this.currentPlayerDidForfeit) {
      const losingPlayerName = this.getNameOfPlayer(this.boardController.currentPlayerID);
      const winningPlayerName = this.getNameOfLosingPlayer(this.boardController.currentPlayerID);
      Leaderboard.updateLeaderboard(winningPlayerName, losingPlayerName);
      return this.getNameOfPlayer(this.boardController.currentPlayerID) + " forfeits the game."
    }
    return "error"
  }

  private winFrames(row: number, col: number) {
    if (!this.win) {
      return
    }
    for (let i = 0; i < this.winPositions.length; i++) {
      if (row == this.winPositions[i][0] && col == this.winPositions[i][1])
        return 'winFrame'
    }
  }

  private handleCellClick(col: number) {
    if (!this.enableMoves || this.win || this.botMoving || this.pause) {
      return
    }
    else {
      if (this.boardController.makeMove(col)) {
        this.botMoving = true
      }
    }
  }



  updated() {
    if (this.eventListenerAdded) {
      return
    }
    this.eventListenerAdded = true
    const cells = this.shadowRoot!.querySelectorAll('.cell')
    if (cells) {
      for (let i = 0; i < cells.length; i++) {
        const cell = cells[i]
        cell.addEventListener('animationend', () => this.handleAnimationEnd())
      }
    }
    this.getRootNode().addEventListener('keydown', (e: Event) => this.keydown(e));
    window.addEventListener("keydown", function(e) {
      if(["Space","ArrowUp","ArrowDown"].indexOf(e.code) > -1) {
          e.preventDefault();
      }
  }, false);
  }

  private keydown(e: Event) {
    const keycode = (e as KeyboardEvent).code
    if ((keycode === "Escape" || keycode === "KeyP") && !this.win && !this.currentPlayerDidForfeit) {
      this.togglePause()
    }
    if(keycode === "KeyB" && (this.pause || this.win || this.currentPlayerDidForfeit)) {
      this.onClickMainMenu()
    }
    if(keycode === "KeyF" && !(this.pause || this.win || this.currentPlayerDidForfeit)) {
      this.onClickForfeit()
    }
    if(keycode === "Enter" && (this.pause || this.win || this.currentPlayerDidForfeit)) {
      this.onClickBack()
    }
    if (keycode === "ArrowLeft" && this.columnHoverIndex > 0) {
      this.columnHoverIndex--
      while(this.columnHoverIndex > 0 && this.boardController.board.board[0][this.columnHoverIndex] !== "") {
        this.columnHoverIndex--
      }
    }
    if (keycode === "ArrowRight" && this.columnHoverIndex < 6) {
        this.columnHoverIndex++
      while(this.columnHoverIndex < 6 && this.boardController.board.board[0][this.columnHoverIndex] !== "") {
        this.columnHoverIndex++
      }
    }
    if ((keycode === "KeyX" || keycode === "ArrowDown" || keycode === "Space") && this.columnHoverIndex >= 0) {
      this.handleCellClick(this.columnHoverIndex)
    }

    if (keycode === "Digit1") {
      this.handleCellClick(0)
    }
    if (keycode === "Digit2") {
      this.handleCellClick(1)
    }
    if (keycode === "Digit3") {
      this.handleCellClick(2)
    }
    if (keycode === "Digit4") {
      this.handleCellClick(3)
    }
    if (keycode === "Digit5") {
      this.handleCellClick(4)
    }
    if (keycode === "Digit6") {
      this.handleCellClick(5)
    }
    if (keycode === "Digit7") {
      this.handleCellClick(6)
    }
    
    
  }

  private doBotMove() {
    let computedMove = this.boardController.getBotMove()
    this.boardController.makeMove(computedMove)
  }


  private handleAnimationEnd() {
    //need a better way to keep track of bot player
    if (this.boardController.currentPlayerID === 'p2' && this.boardController.p2IsBot && !this.win) {
      this.doBotMove()
    } else {
      this.botMoving = false
      this.enableMoves = true
    }
  }

  private handleWin() {
    setTimeout(function () { playSound(buttonwav) }, 2500)
    setTimeout(() => { this.displayWin = true }, 2500)
    this.win = true
    ReplayStore.updateReplays(SettingsStore.p1_name, SettingsStore.p2_name, SettingsStore.curr_game)
    SettingsStore.curr_game = ''
    this.handleColumnHoverEnd();
    this.updateLeaderboard();
  }

  private updateLeaderboard() {
    const winningPlayerName = this.getNameOfPlayer(this.boardController.currentPlayerID);
    const LosingPlayerName = this.getNameOfLosingPlayer(this.boardController.currentPlayerID);
    Leaderboard.updateLeaderboard(winningPlayerName, LosingPlayerName);
  }

  private handleDraw() {
    setTimeout(function () { playSound(buttonwav) }, 800)
    setTimeout(() => { this.displayDraw = true }, 800)
    this.win = true
    ReplayStore.updateReplays(SettingsStore.p1_name, SettingsStore.p2_name, SettingsStore.curr_game);
    SettingsStore.curr_game = ''
  }

  private onClickMainMenu() {
    window.location.href = "./index"
  }

  private onClickForfeit() {
    playSound(buttonwav)
    if (this.boardController.forfeit()) {
      this.currentPlayerDidForfeit = true
      SettingsStore.curr_game = ''
    }
  }

  private togglePause() {
    this.pause = !this.pause
  }

  private onClickBack() {
    window.history.back()
  }

  onMove(row: number, col: number, value: string): void {
    this.viewBoard[row][col] = value
    playSound(tokenwav)
  }

  onWin(winPositions: number[][]) {
    this.winPositions = winPositions
    this.handleWin()
  }

  onDraw(winPositions: number[][]) {
    this.winPositions = winPositions
    this.handleDraw()
  }

  onMovesEnabledChanged(isEnabled: boolean) {
    this.enableMoves = isEnabled
  }

  private getColorForPlayer(player: string) {
    if (player === 'p1') {
      return this.player1Color
    } else if (player === 'p2') {
      return this.player2Color
    } else {
      return null
    }
  }

  private getNameOfPlayer(player: string) {
    if (player === 'p1') {
      return SettingsStore.p1_name
    } else 
      return SettingsStore.p2_name
  }

  private getNameOfLosingPlayer(player: string) {
    if (player === 'p1') {
      return SettingsStore.p2_name
    } else {
      return SettingsStore.p1_name
    }
  }
     

  


  static styles = css`
  :host {
    max-width: 1280px;
    margin: 0 auto;
    padding: 2rem;
    text-align: center;
  }

  .board {
    display: grid;
    grid-template-columns: repeat(7, 50px);
    gap: 5px;
  }

  .cell {
    position: relative;
    width: 50px;
    height: 50px;
    border: 1px solid #333;
    cursor: pointer;
    overflow: visible;
  }

  .token {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: var(--player-color);
    animation: drop 0.5s ease-in-out;
  }

  @keyframes drop {
    from {
      transform: translateY(calc(-55px * var(--rowIndex, 0)));
    }
    to {
      transform: translateY(0);
    }
  }

  .hidden {
    opacity: 0;
    width: 0px;
    height: 0px;
  }

  .winHolder {
    position: absolute;
    z-index: 2;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .winWindow {
    position: relative;
    width: 400px;
    height: 200px;
    background-color: #242424;
    border-radius: 8px;
    border: 2px solid #ffffff;
  }

  .winFrame {
    position: relative;
    z-index: 1;
    width: 50px;
    height: 50px;
    border: 1px solid #333;
    animation: flicker 1.5s ease-in-out;
    animation-delay: .5s;
  }
  .pauseWindow {
    position: relative;
    width: 400px;
    height: 200px;
    background-color: #242424;
    border-radius: 8px;
    border: 2px solid #ffffff;

  }

  @keyframes flicker {
    25%, 75% {
      opacity: 0;
    }
    0%, 50%, 100% {
      opacity: 1;
    }
  }

  button {
    position: relative;
    border-radius: 8px;
    border: 1px solid transparent;
    font-size: 1em;
    font-weight: 500;
    font-family: inherit;
    background-color: #1a1a1a;
    cursor: pointer;
    transition: border-color 0.25s;
    height:50px;
    width:100px;
    margin: 25px;
  }
  button:hover {
    border-color: #646cff;
  }
  button:focus,
  button:focus-visible {
    outline: 4px auto -webkit-focus-ring-color;
  }
  @media (prefers-color-scheme: light) {
    a:hover {
      color: #747bff;
    }
    button {
      background-color: #f9f9f9;
    }
    .winWindow {
      background-color: #ffffff;
      border: 2px solid #242424;
    }
    .pauseWindow {
      background-color: #ffffff;
      border: 2px solid #242424;
    }
  }
`;
}

declare global {
  interface HTMLElementTagNameMap {
    'game-board': gameBoardView
  }
}
