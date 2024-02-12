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
  @property({ type: Boolean}) win:boolean = false;
  

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
            <div class="cell" @click=${() => this.handleCellClick(colIndex)}>
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
      this.checkWinner(row, col);
      if (this.currentPlayer === 'Player 1') {
        this.currentPlayerColor = this.player2Color;
        this.currentPlayer = 'Player 2';
      } else {
        this.currentPlayerColor = this.player1Color;
        this.currentPlayer = 'Player 1';
      }
      if (!this.win) {
        playSound('token.wav');
      }
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
  // Also optimized it to only check possible wins from last move
  private checkWinner(row: number, col: number) {
    let winPositions: number[][] = [];
    console.log("Row: ", row, "Col: ", col);
    let color = this.board[row][col];
    // Check 4 in a row
    if (col <= 3) {
      if (color === this.board[row][col + 1] && color === this.board[row][col + 2] && color === this.board[row][col + 3]) {
        for (let i = 0; i < 4; i++) {
          winPositions.push([row, col + i]);
        }
      }
    }
    if (col >= 2) {
      if (color === this.board[row][col - 1] && color === this.board[row][col - 2] && color === this.board[row][col - 3]) {
        for (let i = 0; i < 4; i++) {
          winPositions.push([row, col - i]);
        }
      }
    }
    // Check 4 in a column
    if (row <= 2) {
      if (color === this.board[row + 1][col] && color === this.board[row + 2][col] && color === this.board[row + 3][col]) {
        for (let i = 0; i < 4; i++) {
          winPositions.push([row + i, col]);
        }
      }
    }
    if (row >= 3) {
      if (color === this.board[row - 1][col] && color === this.board[row - 2][col] && color === this.board[row - 3][col]) {
        for (let i = 0; i < 4; i++) {
          winPositions.push([row - i, col]);
        }
      }
    }
    // Check 4 in a diagonal
    // Right-down diagonal
    
    if (row <= 2 && col <= 3) {
      if (color === this.board[row + 1][col + 1] && color === this.board[row + 2][col + 2] && color === this.board[row + 3][col + 3]) {
        for (let i = 0; i < 4; i++) {
          winPositions.push([row + i, col + i]);
        }
      }
    }
    // Left-down diagonal
    if (row <= 2 && col >= 2) {
      if (color === this.board[row + 1][col - 1] && color === this.board[row + 2][col - 2] && color === this.board[row + 3][col - 3]) {
        for (let i = 0; i < 4; i++) {
          winPositions.push([row + i, col - i]);
        }
      }
    }
    // Left-up diagonal
    if (row >= 3 && col >= 2) {
      if (color === this.board[row - 1][col - 1] && color === this.board[row - 2][col - 2] && color === this.board[row - 3][col - 3]) {
        for (let i = 0; i < 4; i++) {
          winPositions.push([row - i, col - i]);
        }
      }
    }
    // Right-up diagonal
    if (row >= 3 && col <= 3) {
      if (color === this.board[row - 1][col + 1] && color === this.board[row - 2][col + 2] && color === this.board[row - 3][col + 3]) {
        for (let i = 0; i < 4; i++) {
          winPositions.push([row - i, col + i]);
        }
      }
    }
    if (winPositions.length != 0) {
      this.handleWin(winPositions);
      return winPositions;
    }
    return null;
  }

  private handleWin(winPositions: number[][]) {
    playSound('button.wav');
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
