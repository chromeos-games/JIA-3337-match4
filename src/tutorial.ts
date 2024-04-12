import { customElement, property } from 'lit/decorators.js';
import { LitElement, html, css } from 'lit';
import {playSound} from './main-menu.ts';
import { BoardModel } from './board-model.ts';

@customElement('tutorial-board')
export class tutorialBoard extends LitElement {
  @property({ type: Array }) board: string[][] = [];
  @property({ type: String }) currentPlayer: string = 'Red';
  @property({ type: Boolean }) enableMoves: boolean = true;
  @property({ type: Boolean }) eventListenerAdded: boolean = false;
  @property({ type: Boolean }) win: boolean = false;
  @property({ type: String }) winner: string = ''; 

  connectedCallback() {
    super.connectedCallback()
  
    playSound('button.wav')
  }

  constructor() {
    super();
    this.initBoard();

  }

  initBoard() {
    this.board = Array.from({ length: 6 }, () => Array(7).fill(null));
  }


  render() {
    let turnName = this.currentPlayer === 'Red' ? 'Your' : "Opponent's";
    return html`
      <h2>Match4 - ${turnName} Turn</h2>
      <p>Click on a column of the game board to drop a token</p>
      <p>The computer will play against you.</p>
      <p>Be the first to connect 4 to win!</p>
      <div class="board">
        ${this.board.map((row, rowIndex) =>
          row.map((cell, colIndex) =>
            html`
              <div class="cell" @click=${() => this.handleCellClick(colIndex)}>
                ${cell
                  ? html`<div class="token ${cell}" style="--rowIndex: ${rowIndex};"></div>`
                  : null
                }
              </div>
            `
          )
        )}
      </div>
      <button @click=${this.onClickBack}>Back</button>
      <div class="${this.shouldShowWinWindow() ? 'winHolder' : 'hidden'}">
          <div class ="${this.shouldShowWinWindow() ? 'winWindow' : 'hidden'}">
            <h2>${this.getWinningMessage()}</h2>
            <button @click=${this.onClickMainMenu} style="position:absolute; right: 10px; bottom: 10px">Main Menu</button>
            <button @click=${this.onClickBack} style="position:absolute; left: 10px; bottom: 10px">Replay</button>
          </div>
      </div>
    `;
  }

  private handleCellClick(col: number) {
    console.log("Cell Clicked")
    if (!this.enableMoves) {
      console.log("move disabled")
      return;
    }
    
    const row = this.findAvailableRow(col);
    console.log("Row: " + row + " Col: " + col)
    if (row !== -1) {
      this.board[row][col] = this.currentPlayer;
      const winner = this.checkWinningNode(this.board);
      if (winner) {
        this.handleWin(winner)
      }
      this.currentPlayer = this.currentPlayer === 'Red' ? 'Yellow' : 'Red';
      this.enableMoves = false;
    }

  }

  private handleWin(winner:string) {
    this.win = true
    this.winner = winner
    this.enableMoves = false
  }

  private shouldShowWinWindow() {
    return this.win
  }

  private getWinningMessage() {
    return html`<span>${this.winner} Wins! Congratulations! 🎉</span>`;
  }

  private onClickMainMenu() {
    console.log("Main Menu Clicked")
    window.location.href = '/'
  }


  updated() {
    if (this.eventListenerAdded) {
      return;
    }
    this.eventListenerAdded = true;
    const cells = this.shadowRoot!.querySelectorAll('.cell');
    if (cells) {
      for (let i = 0; i < cells.length; i++) {
        const cell = cells[i];
        cell.addEventListener('animationend', () => this.handleAnimationEnd());
      }
    }
    this.getRootNode().addEventListener('keydown', (e: Event) => this.keydown(e));
  }
  private keydown(e: Event) {
    if ((e as KeyboardEvent).code === "Escape" || (e as KeyboardEvent).code === "KeyB") {
      this.onClickBack()
    }
  }


  private findAvailableRow(col: number): number {
    for (let row = 5; row >= 0; row--) {
      if (!this.board[row][col]) {
        return row;
      }
    }
    return -1; // Column is full
  }
  private handleAnimationEnd() {
    if (this.winner) {
      return
    }
    // play sound, check win?
    playSound('token.wav')
    // console.log("Animation Ended")
    this.enableMoves = true;
    // Simulate opponent's move. Tutorial opponent cannot act intelligently.
    if (this.currentPlayer === 'Yellow') {
        //console.log("Simulating Opponent's Move")
        this.handleCellClick(Math.floor(Math.random() * 7));
    }
  }

  private checkWinningNode(board: string[][]): string{
    //Horizontal
    console.log(this.currentPlayer)
    
    for (let col = 0; col < 7-3; col++){
        for (let row = 0; row < 6; row++){
            let player = board[row][col]
            if (player != null && player === board[row][col + 1] && player === board[row][col + 2] && player === board[row][col + 3]) {
                return this.currentPlayer
            }
        }
    }
    //Vertical
    for (let col = 0; col < 7; col++){
        for (let row = 0; row < 6-3; row++){
            let player = board[row][col]
            if (player != null && player === board[row+1][col] && player === board[row+2][col] && player === board[row+3][col]) {
                
                return this.currentPlayer
            }
        }
    }
    //Diags
    for (let col = 0; col < 7-3; col++){
        for (let row = 0; row < 6-3; row++){
            let player = board[row][col]
            if (player != null && player === board[row+1][col+1] && player === board[row+2][col+2] && player === board[row+3][col+3]) {
                
                return this.currentPlayer
            }
        }
    }
    for (let col = 0; col < 7-3; col++){
        for (let row = 3; row < 6; row++){
            let player = board[row][col]
            if (player != null && player === board[row-1][col+1] && player === board[row-2][col+2] && player === board[row-3][col+3]) {
                return this.currentPlayer
            }
        }
    }
    return ''
}

  private onClickBack() {
    console.log("Back Clicked")
    window.history.back()
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
    animation: drop 0.5s ease-in-out;
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

  .hidden {
    opacity: 0;
    width: 0px;
    height: 0px;
  }

  .Red { background-color: #ff5252; }
  .Yellow { background-color: #ffd740; }

  @keyframes drop {
    from {
      transform: translateY(calc(-55px * var(--rowIndex, 0)));
    }
    to {
      transform: translateY(0);
    }
  }
  button {
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
    'tutorial-board': tutorialBoard
  }
}