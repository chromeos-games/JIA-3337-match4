import { customElement, property } from 'lit/decorators.js';
import { LitElement, html, css } from 'lit';
import {playSound} from './main-menu.ts';
import { SettingsStore } from './utils/settings-store.ts';

@customElement('game-board')
export class gameBoard extends LitElement {
  @property({ type: String }) firstPlayer = SettingsStore.firstPlayer;
  @property({ type: String }) p1_name = SettingsStore.p1_name;
  @property({ type: String }) p2_name = SettingsStore.p2_name;
  @property({ type: Array }) board: string[][] = [];
  @property({ type: String }) currentPlayerColor: string = 'Red';
  @property({ type: Boolean }) enableMoves: boolean = true;
  @property({ type: Boolean }) eventListenerAdded: boolean = false;
  
  currentPlayer: string = this.firstPlayer === 'p1' ? this.p1_name : this.p2_name;

  gameScale: number = SettingsStore.scale;

  player1Color: string = SettingsStore.player1TokenColor;
  player2Color: string = SettingsStore.player2TokenColor;

  //First number indicates who went first. 0 (false) means P1, 1 (true) means P2
  //Erase currGame if starting new game
  currGame: string = SettingsStore.curr_game;

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
    if (this.currGame.length != 0){
      console.log('loading previous game')
      //Set the correct current player
      if (parseInt(this.currGame[0])===0) {
        this.currentPlayer = this.p1_name
        this.currentPlayerColor = this.player1Color
      } else {
        this.currentPlayer = this.p2_name
        this.currentPlayerColor = this.player2Color
      }

      for (let i = 1; i < this.currGame.length; i++){
        console.log(parseInt(this.currGame[i]))
        this.makeMove(parseInt(this.currGame[i]))
      }

      this.currGame = this.currGame
    } else {
      this.currGame = this.firstPlayer === 'p1' ? '0' : '1'
    }
  }


  render() {
    return html`
    <h1>Match4 - ${this.currentPlayer}'s Turn</h1>
    <div class="board" style="--game-scale: ${this.gameScale};">
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
  
    if (this.makeMove(col)){
      this.currGame += col.toString()
      SettingsStore.curr_game = this.currGame
      console.log(col)
      console.log(this.currGame)
    }
  }

private makeMove(col: number): boolean {
  const row = this.findAvailableRow(col);
  if (row === -1){
    return false;
  }
  this.board[row][col] = this.currentPlayerColor;
  //Chen: Why do we change colors twice here? Once here and another in the if-else block below
  this.currentPlayerColor = this.currentPlayerColor === this.player1Color ? this.player2Color : this.player1Color;
  this.enableMoves = false;

  if (this.currentPlayer === this.p1_name) {
    this.currentPlayerColor = this.player2Color;
    this.currentPlayer = this.p2_name;
  } else {
    this.currentPlayerColor = this.player1Color;
    this.currentPlayer = this.p1_name;
  }
  return true
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
    transform: scale(var(--game-scale))
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
    'game-board': gameBoard
  }
}
