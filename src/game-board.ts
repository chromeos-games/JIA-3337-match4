import { customElement, property } from 'lit/decorators.js';
import { LitElement, html, css } from 'lit';
import {playSound} from './main-menu.ts';
import { SettingsStore } from './utils/settings-store.ts';

@customElement('game-board')
export class gameBoard extends LitElement {
  @property({ type: String }) firstPlayer = SettingsStore.firstPlayer;
  @property({ type: Array }) board: string[][] = [];
  @property({ type: String }) currentPlayerColor: string = 'Red';
  @property({ type: Boolean }) enableMoves: boolean = true;
  @property({ type: Boolean }) eventListenerAdded: boolean = false;
  @property({ type: Boolean}) win: boolean = false;
  @property({ type: Array}) winPositions: number[][] = [];
  

  currentPlayer: string = this.firstPlayer === 'p1' ? 'Player 1' : 'Player 2';
  player1Color: string = SettingsStore.player1TokenColor;
  player2Color: string = SettingsStore.player2TokenColor;

  connectedCallback() {
    super.connectedCallback()
    this.currentPlayerColor = this.firstPlayer === 'p1' ? this.player1Color : this.player2Color;
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
    return html`
    <h1>Match4 - ${this.currentPlayer}'s Turn</h1>
    <div class="board">
      ${this.board.map((row, rowIndex) =>
        row.map((cell, colIndex) =>
          html`
            <div class="cell ${this.winFrames(rowIndex, colIndex)}" @click=${() => this.handleCellClick(colIndex)}>
              ${cell
                ? html`<div class="token" style="background-color: ${cell}; --rowIndex: ${rowIndex};"></div>`
                : null
              }
            </div>
          `
        )
      )}
      
    </div>
    <button @click=${this.onClickMainMenu}>Main Menu</button>
  `;
}

  private winFrames(row: number, col: number) {
    if (!this.win) {
      return;
    }
    for (let i = 0; i < this.winPositions.length; i++) {
      if (row == this.winPositions[i][0] && col == this.winPositions[i][1])
       // return html`style="width:49px; height:49px; border: 2px solid #009900; animation: flicker 1.5s ease-in-out; animation-delay .5s; cursor: default;"`
        return 'winFrame';
      }
  }

  private handleCellClick(col: number) {
    if (!this.enableMoves || this.win) {
      console.log("Moves are disabled")
      return;
    }
    const row = this.findAvailableRow(col);
    if (row !== -1) {
      this.board[row][col] = this.currentPlayerColor;
      this.currentPlayerColor = this.currentPlayerColor === this.player1Color ? this.player2Color : this.player1Color;
      this.enableMoves = false;
      this.checkWinner();
      if (this.currentPlayer === 'Player 1') {
        this.currentPlayerColor = this.player2Color;
        this.currentPlayer = 'Player 2';
      } else {
        this.currentPlayerColor = this.player1Color;
        this.currentPlayer = 'Player 1';
      }
      playSound('token.wav');
    }
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
        cell.addEventListener('animationend', () => this.handleAnimationEnd(i, 0));
      }
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
  private handleAnimationEnd(row: number, col: number) {
    // play sound, check win?
    console.log("Animation Ended")
    this.enableMoves = true;
  }

  // Rewrote checkWinner function for cases where a single piece wins in multiple ways
  private checkWinner() {
    //tokens are stored as colors
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 7; col++) {
        if (this.board[row][col]) {
          let color = this.board[row][col];
          //we start in the top left which means we only need to check right, down, and diagonally right and left
          if (color === this.getBoardElement(row, col + 1) && color === this.getBoardElement(row, col + 2) && color === this.getBoardElement(row, col + 3)) {
            for (let i = 0; i < 4; i++) {
              this.winPositions.push([row, col + i]);
            }
          } else if (color === this.getBoardElement(row + 1, col) && color === this.getBoardElement(row + 2, col) && color === this.getBoardElement(row + 3, col)) {
            for (let i = 0; i < 4; i++) {
              this.winPositions.push([row + i, col]);
            }
          } else if (color === this.getBoardElement(row + 1, col + 1) && color === this.getBoardElement(row + 2, col + 2) && color === this.getBoardElement(row + 3, col + 3)) {
            for (let i = 0; i < 4; i++) {
              this.winPositions.push([row + i, col + i]);
            }
          } else if (color === this.getBoardElement(row + 1, col - 1) && color === this.getBoardElement(row + 2, col - 2) && color === this.getBoardElement(row + 3, col - 3)) {
            for (let i = 0; i < 4; i++) {
              this.winPositions.push([row + i, col - i]);
            }
          }
        }
      }
    }
    if(this.winPositions.length != 0) {
      this.handleWin();
    }
  }

  private getBoardElement(row: number, col: number) {
    if (row < 0 || row >= this.board.length) {
      return "Invalid";
    }
    if (col < 0 || col >= this.board[0].length) {
      return "Invalid";
    }
    return this.board[row][col];
  }

  private handleWin() {
    setTimeout(function(){playSound('button.wav')}, 1600);
    this.win = true;
    console.log("Game Won!")
  }

  private onClickMainMenu() {
    console.log("Main Menu Clicked")
    window.location.href = '/'
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
    'game-board': gameBoard
  }
}
