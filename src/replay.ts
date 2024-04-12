import { LitElement, css, html } from 'lit'
import { customElement, property} from 'lit/decorators.js'
import { playSound} from './main-menu.ts';
import { SettingsStore } from './utils/settings-store.ts'
import { tokenColor } from './enums.ts';
import { TokenInfo } from './utils/token-info.ts';

@customElement('replay-page')
export class ReplayPage extends LitElement {
  @property({ type: Array }) viewBoard: TokenInfo[][] = [];
  @property({ type: String }) currentPlayer: string = SettingsStore.curr_replay[0];
  @property({ type: Boolean }) eventListenerAdded: boolean = false;
  @property({ type: Array}) moves: string = SettingsStore.curr_replay[2]
  @property({ type: Number}) slideIndex: number = 0;

  player1Color: string = SettingsStore.player1TokenColor
  player2Color: string = SettingsStore.player2TokenColor
  
  connectedCallback() {
    super.connectedCallback()
    playSound('button.wav')
    
  }

  constructor() {
    super();
    this.initBoard();
  }

  initBoard() {
    this.viewBoard = Array.from({ length: 6 }, () => Array(7).fill(null));
  }

  render() {
    return html`
      <div style="display: flex; flex-direction: column; align-items: center;">
      <h1>Match 4 <span style = "color:${this.getColorForPlayer(this.currentPlayer)}"> ${this.currentPlayer}'s</span> turn</h1>
        <div class="board">
          ${this.viewBoard.map((row, rowIndex) =>
            row.map((cell) =>
            html`
            <div class="cell">
              ${cell
                ? html`<div class="token" style="--rowIndex: ${rowIndex}; background-color: ${cell.color as tokenColor}"></div>`
                : null
              }
            </div>
          `
            )
          )}
        </div>
      </div>
      
      <button @click=${this.onTriggerReplay}> ${this.slideIndex == 0 ? 'Start' : (this.slideIndex == this.moves.length ? 'Reset' : 'Playing')} 
        </button>
      <button @click=${this.onClickBack}> Back </button>
    `
  }

  private getColorForPlayer(player: string) {
    if (player === SettingsStore.curr_replay[0]) {
      return this.player1Color
    } else {
      return this.player2Color
    }
  }

  private onTriggerReplay() {
    if (this.slideIndex == 0) {
      console.log("Replay Started")
      for (let i = 0; i < this.moves.length; i++) {
        setTimeout(() => this.updateCell(), 900 * i);
      }
    } else if (this.slideIndex == this.moves.length) {
      console.log("Resetting")
      this.slideIndex = 0;
      this.initBoard();
    }
    
  }

  private updateCell() {
    const col = Number(this.moves[this.slideIndex]); // Convert col to a number
    const row = this.findAvailableRow(col);
    this.slideIndex++;
    if (row !== -1) {
      this.viewBoard[row][col] = {
        player: this.currentPlayer,
        color: this.getColorForPlayer(this.currentPlayer)
      };
      
      this.currentPlayer = this.currentPlayer ===  SettingsStore.curr_replay[0] ? SettingsStore.curr_replay[1] : SettingsStore.curr_replay[0];
    }
  }

  private findAvailableRow(col: number): number {
    for (let row = 5; row >= 0; row--) {
      if (!this.viewBoard[row][col]) {
        return row;
      }
    }
    return -1; // Column is full
  }

  private onClickBack() {
    window.history.back()
  }

  private handleAnimationEnd() {
    if (this.slideIndex != this.moves.length) {
      playSound('token.wav')
    } else {
      playSound('button.wav')
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
        cell.addEventListener('animationend', () => this.handleAnimationEnd());
      }
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
    'replay-page': ReplayPage
  }
}