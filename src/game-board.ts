import { customElement, property } from 'lit/decorators.js'
import { LitElement, html, css } from 'lit'
import { playSound } from './main-menu.ts'
import { SettingsStore } from './utils/settings-store.ts'
import { BoardController } from './board-controller.ts'

@customElement('game-board')
export class gameBoardView extends LitElement {

  @property({ type: Boolean }) enableMoves: boolean = true
  @property({ type: Boolean }) botMoving: boolean = false
  @property({ type: Boolean }) eventListenerAdded: boolean = false
  @property({ type: Boolean }) win: boolean = false
  @property({ type: Array }) winPositions: number[][] = []
  @property({ type: Boolean }) displayWin: boolean = false
  @property({ type: Boolean }) displayDraw: boolean = false
  @property({ type: BoardController }) boardController
  @property({ type: Array }) viewBoard: string[][] = []

  gameScale: number = SettingsStore.scale

  player1Color: string = SettingsStore.player1TokenColor
  player2Color: string = SettingsStore.player2TokenColor

  connectedCallback() {
    super.connectedCallback()
    playSound('button.wav')
  }

  constructor() {
    super()
    this.viewBoard = Array.from({ length: 6 }, () => Array(7).fill(null))
    this.boardController = new BoardController(this)
  }

  render() {
    let winningPlayer = this.getNameOfPlayer(this.boardController.currentPlayerID)
    return html`
    <div style="--game-scale: ${this.gameScale}; transform: scale(var(--game-scale));">
      <h1>Match 4${this.displayWin ? null : " - " + this.getNameOfPlayer(this.boardController.currentPlayerID) + "'s turn"}</h1>
      <div class="board">
        ${this.viewBoard.map((row, rowIndex) =>
      row.map((player, colIndex) =>
        html`
              <div class="cell ${this.winFrames(rowIndex, colIndex)}" @click=${() => this.handleCellClick(colIndex)}>
                ${this.getColorForPlayer(player)
            ? html`<div class="token" style="background-color: ${this.getColorForPlayer(player)}; --rowIndex: ${rowIndex};"></div>`
            : null
          }
              </div>
            `
      )
    )}
      </div>
      <div class="${this.displayWin || this.displayDraw ? 'winHolder' : 'hidden'}">
          <div class ="${this.displayWin || this.displayDraw ? 'winWindow' : 'hidden'}">
            <h2> ${this.displayWin ? winningPlayer + " Wins!" : "Draw!"}</h2>
            <button @click=${this.onClickMainMenu} style="position:absolute; right: 10px; bottom: 10px">Main Menu</button>
            <button @click=${this.onClickBack} style="position:absolute; left: 10px; bottom: 10px">Replay</button>
          </div>
      </div>
      <button @click=${this.onClickMainMenu} style="${this.displayWin ? "visibility: hidden;" : null}">Main Menu</button>
    </div>
  `
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
    if (!this.enableMoves || this.win || this.botMoving) {
      console.log("Moves are disabled")
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
  }

  private doBotMove() {
    let computedMove = this.boardController.getBotMove()
    this.boardController.makeMove(computedMove)
  }


  private handleAnimationEnd() {
    if (this.boardController.currentPlayerID === 'p2' && this.boardController.p2IsBot && !this.win) {
      this.doBotMove()
    } else {
      this.botMoving = false
      this.enableMoves = true
    }
  }

  //automatically saves games. we will need to decide on a max number of saved games and delete the oldest one when we have too many
  private handleWin() {
    SettingsStore.savedGames.push(SettingsStore.curr_game)
    setTimeout(function () { playSound('button.wav') }, 2500)
    setTimeout(() => { this.displayWin = true }, 2500)
    this.win = true
    console.log("Game Won!")
  }

  private handleDraw() {
    SettingsStore.savedGames.push(SettingsStore.curr_game)
    setTimeout(function () { playSound('button.wav') }, 800)
    setTimeout(() => { this.displayDraw = true }, 800)
    this.win = true
    console.log("Game draw.")
  }

  private onClickMainMenu() {
    console.log("Main Menu Clicked")
    window.location.href = '/'
  }

  private onClickBack() {
    console.log("Back Clicked")
    window.history.back()
  }

  onMove(row: number, col: number, value: string): void {
    this.viewBoard[row][col] = value
    playSound('token.wav')
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
    } else if (player === 'p2') {
      return SettingsStore.p2_name
    } else {
      return null
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
  }
`;
}

declare global {
  interface HTMLElementTagNameMap {
    'game-board': gameBoardView
  }
}
