import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js';
import { style } from './style.ts';
import { SettingsStore } from './utils/settings-store.ts';
import { buttonColor } from './enums.ts';

@customElement('setup-bot-page')
export class SetupPage extends LitElement {
  @property({ type: String }) firstPlayer = 'p1';
  @property({ type: String }) p1_name = 'Player 1';
  @property({ type: String }) p2_name = 'Bot';
  @property({ type: String }) difficulty = 'medium';
  @property({ type: Boolean }) randomize = false;
  @property({ type: String }) p2IsBot = 'true';

  render() {
    return html`
      <slot></slot>
    <div class="card-deck">
      <input type="text" id = "p1_name" style = "position:relative;"  placeholder = "Player 1 Name" @change=${this.onChangeP1Name}/>
      <div class="card">
      <button @click=${this.onClickEasy} class="difficulty" part="easy" style = "position:relative; height:125px; width:125px; right:20px; background:lightgrey; color: black; font-size:20px" > Easy </button>
      <button @click=${this.onClickMedium} class="difficulty" part="medium" style = "position:relative; height:125px; width:125px; background:lightgrey; color: black; font-size:20px" > Medium </button>
      <button @click=${this.onClickHard} class="difficulty" part="hard" style = "position:relative; height:125px; width:125px; left:20px; background:lightgrey; color: black; font-size:20px" > Hard </button>
      </div>

      <legend>Select Who Goes First</legend>
      <div class="card">
        <input type="radio" id = "p1" style = "position:relative; right:120px;" value = "p1" name="firstPlayer"
            ?checked=${this.firstPlayer === 'p1'} @change=${this._onClickRadio}/>
            <label style = "position:relative; right:120px" for="p1"> Player 1 </label>
          <input type="radio" id = "p2" style = "position:relative; left:100px" value = "p2" name="firstPlayer"
            ?checked=${this.firstPlayer === 'p2'} @change=${this._onClickRadio} />
            <label style = "position:relative; left:100px" for= "p2"> Bot </label>
          
        </div>
        <div class="card">
          <button @click=${this.onClickRandom} part="button" style = "position:relative; height:55px;" >
            Randomize
          </button>
        </div>
      </div>
      <div class="card">
      <button @click=${this.onClickBack} part="button" style = "position:relative; margin-right: 20px" >
          Back
        </button>
        <button @click=${this._onClickStart} part="button" style = "position:relative" >
          Start Game
        </button>
      </div>
    `
  }

  updated() {
    this.getRootNode().addEventListener('keydown', (e: Event) => this.keydown(e));
  }
  private keydown(e: Event) {
    if ((e as KeyboardEvent).code === "Escape" || (e as KeyboardEvent).code === "KeyB") {
      this.onClickBack()
    }
    if((e as KeyboardEvent).code === "Enter") {
      this._onClickStart()
    }
  }

  private _onClickRadio(e: { target: { value: string; }; }) {
    this.firstPlayer = e.target.value
  }

  private onClickRandom(e: { target: { style: { backgroundColor: string; }; }; }) {
    this.randomize = !this.randomize
    e.target.style.backgroundColor = this.randomize ? buttonColor.Orange: ""
    
    const radios = this.shadowRoot?.querySelectorAll('[name="firstPlayer"]') as NodeListOf<HTMLElement> | null;
    if (radios) {
      radios.forEach((element) => element.disabled = this.randomize ? true : false)
    }
  }

  private onChangeP1Name(e: {target: { value: string; }}){
    this.p1_name = e.target.value
  }

  private onClickEasy(){
    this.difficulty = 'easy'
    this.resetButtons()
    const button = this.shadowRoot?.querySelector('button[part="easy"]') as HTMLElement | null;
    if (button) {
      button.style.backgroundColor = buttonColor.Green;
    }
  }
  private onClickMedium(){
    this.difficulty = 'medium'
    this.resetButtons()
    const button = this.shadowRoot?.querySelector('button[part="medium"]') as HTMLElement | null;
    if (button) {
      button.style.backgroundColor = buttonColor.Yellow;
    }
  }
  private onClickHard(){
    this.difficulty = 'hard'
    this.resetButtons()
    const button = this.shadowRoot?.querySelector('button[part="hard"]') as HTMLElement | null;
    if (button) {
      button.style.backgroundColor = buttonColor.Red;
    }
  }

  private resetButtons(){
    const buttons = this.shadowRoot?.querySelectorAll('button[class="difficulty"]') as NodeListOf<HTMLElement> | null;
    if (buttons) {
      buttons.forEach((element) => element.style.backgroundColor = "lightgrey")
    }
  }

  private _onClickStart() {
    SettingsStore.firstPlayer = this.randomize ? (Math.random() < 0.5 ? 'p1' : 'p2'): this.firstPlayer
    SettingsStore.p1_name = this.p1_name
    SettingsStore.p2_name = this.p2_name
    SettingsStore.difficulty = this.difficulty
    SettingsStore.curr_game = ''
    SettingsStore.p2IsBot = this.p2IsBot
    this.navigate("/game")
  }

  private onClickBack() {
    window.location.href = '/'
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
      'setup-bot-page': SetupPage
    }
  }
