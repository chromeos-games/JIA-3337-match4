import { customElement, property } from 'lit/decorators.js';
import { LitElement, html, css } from 'lit';
import {playSound} from './main-menu.ts';
import { getCookie } from 'typescript-cookie';

@customElement('game-board')
export class gameBoard extends LitElement {
  @property({ type: Array }) board: string[][] = [];
  @property({ type: String }) currentPlayer: string = 'Player 1';
  @property({ type: String }) currentPlayerColor: string = 'Red';
  @property({ type: Boolean }) enableMoves: boolean = true;
  @property({ type: Boolean }) eventListenerAdded: boolean = false;
  
  

  player1Color: string = getCookie('player1Color') || '#ff5252'; // Default red
  player2Color: string = getCookie('player2Color') || '#ffd740'; // Default yellow, replace with cookie or setting

  connectedCallback() {
    super.connectedCallback()
    this.currentPlayer = 'Player 1'
    this.currentPlayerColor = this.player1Color;

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
    if (!this.enableMoves) {
      return;
    }
  
    const row = this.findAvailableRow(col);
    if (row !== -1) {
      this.board[row][col] = this.currentPlayerColor;
      this.currentPlayerColor = this.currentPlayerColor === this.player1Color ? this.player2Color : this.player1Color;
      this.enableMoves = false;
    }

    if (this.currentPlayer === 'Player 1') {
      this.currentPlayerColor = this.player2Color;
      this.currentPlayer = 'Player 2';
    } else {
      this.currentPlayerColor = this.player1Color;
      this.currentPlayer = 'Player 1';
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
    playSound('token.wav')
    console.log("Animation Ended")
    this.enableMoves = true;
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
