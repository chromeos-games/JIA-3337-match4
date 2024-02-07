import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js';
import { style } from './style.ts';
import { SettingsStore } from './utils/settings-store.ts';

@customElement('setup-page')
export class SetupPage extends LitElement {
  @property({ type: String }) firstPlayer = 'p1';

  render() {
    return html`
      <slot></slot>
      <div class="card-deck">
      <legend>Select Who Goes First</legend>
        <div class="card">
          <input type="radio" id = "p1" style = "position:relative" value = "p1" name="firstPlayer"
            ?checked=${this.firstPlayer === 'p1'} @change=${this._onClickRadio}/>
            <label for="p1"> Player 1 </label>
        </div>
        <div class="card">
          <input type="radio" id = "p2" style = "position:relative" value = "p2" name="firstPlayer"
            ?checked=${this.firstPlayer === 'p2'} @change=${this._onClickRadio} />
            <label for= "p2"> Player 2 </label>
        </div>
        <div class="card">
          <button @click=${this.onClickRandom} part="button" style = "position:relative; height:55px" >
            Randomize
          </button>
        </div>
      </div>
      <div class="card">
        <button @click=${this._onClickStart} part="button" style = "position:relative" >
          Start Game
        </button>
      </div>
    `
  }
  private _onClickRadio(e: { target: { value: string; }; }) {
    this.firstPlayer = e.target.value
  }

  private onClickRandom() {
    this.firstPlayer = Math.random() < 0.5 ? 'p1' : 'p2'
  }

  private _onClickStart() {
    console.log("Start Clicked")
    SettingsStore.firstPlayer = this.firstPlayer
    this.navigate("/game")
  }

  private navigate(location: string) {
    window.location.href = location
  }

  static styles = [style, css`
    .selected {
      border-color: #646cff;
    }
  `]

}

declare global {
    interface HTMLElementTagNameMap {
      'setup-page': SetupPage
    }
  }
