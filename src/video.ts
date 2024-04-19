import { LitElement, css, html } from 'lit'
import { customElement, property} from 'lit/decorators.js'
import { playSound} from './main-menu.ts';
import buttonwav from '../button.wav'
import tokenwav from '../token.wav'
@customElement('video-page')
export class VideoPage extends LitElement {
  @property({ type: Array }) board: string[][] = [];
  @property({ type: String }) currentPlayer: string = 'Red';
  @property({ type: Boolean }) eventListenerAdded: boolean = false;
  @property({ type: Array}) moves: number[] = [4, 5, 3, 5, 2, 2, 1]
  @property({ type: Number}) slideIndex: number = 0;


  connectedCallback() {
    super.connectedCallback()
    playSound(buttonwav)
    
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
      <div style="display: flex; flex-direction: column; align-items: center;">
      <h1>Match4 Video Tutorial</h1>
        <p id="p1"> ${this.getTutorialText()} </p>

        <div class="board">
          ${this.board.map((row, rowIndex) =>
            row.map((cell) =>
            html`
            <div class="cell">
              ${cell
                ? html`<div class="token ${cell}" style="--rowIndex: ${rowIndex};"></div>`
                : null
              }
            </div>
          `
            )
          )}
        </div>
      </div>
      
      <button @click=${this.onTriggerTutorial}> ${this.slideIndex == 0 ? 'Start' : (this.slideIndex == this.moves.length ? 'Reset' : 'Playing')} 
        </button>
      <button @click=${this.onClickBack}> Back </button>
    `
  }
  

  private onTriggerTutorial() {
    if (this.slideIndex == 0) {
      for (let i = 0; i < this.moves.length; i++) {
        setTimeout(() => this.updateCell(), 900 * i);
      }
    } else if (this.slideIndex == this.moves.length) {
      this.slideIndex = 0;
      this.initBoard();
    }
    
  }

  private getTutorialText() {
      let tutorialTexts = ["A player begins by placing a token in any column.",
      "Players alternate turns, each placing a token of a different color.",
      "Be the first to connect 4 to win!"];
    if (this.slideIndex == 0) {
      return tutorialTexts[0];
    }
    if (this.slideIndex == this.moves.length) {
      return tutorialTexts[2];
    }
    return tutorialTexts[1];
  }

  private updateCell() {
    const col = this.moves[this.slideIndex];
    const row = this.findAvailableRow(col);
    this.slideIndex++;
    if (row !== -1) {
      this.board[row][col] = this.currentPlayer;
      this.currentPlayer = this.currentPlayer === 'Red' ? 'Yellow' : 'Red';
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

  private onClickBack() {
    window.history.back()
  }

  private handleAnimationEnd() {
    if (this.slideIndex != this.moves.length) {
      playSound(tokenwav)
    } else {
      playSound(buttonwav)
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
    this.getRootNode().addEventListener('keydown', (e: Event) => this.keydown(e));
  }
  
  private keydown(e: Event) {
    if ((e as KeyboardEvent).code === "Escape" || (e as KeyboardEvent).code === "KeyB") {
      this.onClickBack()
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
    'video-page': VideoPage
  }
}