import { customElement, property } from 'lit/decorators.js';
import { LitElement, html, css } from 'lit';

@customElement('game-board')
export class gameBoard extends LitElement {
  @property({ type: Array }) board: string[][] = [];
  @property({ type: String }) currentPlayer: string = 'Red';

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
                  ? html`<div class="token ${cell}" style="--rowIndex: ${rowIndex};"></div>`
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
    const row = this.findAvailableRow(col);
    if (row !== -1) {
      this.updateComplete.then(() => {
        const token = this.shadowRoot!.querySelector(`.token-${row}-${col}`) as HTMLElement;
        if (token) {
          this.addEventListener('animationend', () => this.handleAnimationEnd(row, col));
        }
      });
      this.board[row][col] = this.currentPlayer;
      this.currentPlayer = this.currentPlayer === 'Red' ? 'Yellow' : 'Red';
    }
  }

  updated() {
    // This is a terrible hack to get the animationend event to fire when the token drops
    // TODO: Find a better way to do this
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
    this.playSound()
  }

  private onClickMainMenu() {
    console.log("Main Menu Clicked")
    this.playSound()
    window.location.href = '/'
  }

  private playSound() {
    // TODO: unify sound playing into a single function shared between components
    var audio = new Audio('button.wav')
    audio.volume = 1;
    audio.play()
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
`;
}

declare global {
  interface HTMLElementTagNameMap {
    'game-board': gameBoard
  }
}
