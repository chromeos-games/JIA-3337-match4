 import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js';
import { style } from './style.ts';
import { SettingsStore } from './utils/settings-store.ts';
import { buttonColor } from './enums.ts';
import { playSound } from './main-menu.ts';
import buttonwav from '../button.wav'
@customElement('setup-local-page')
export class SetupPage extends LitElement {
  @property({ type: String }) firstPlayer = 'p1';
  @property({ type: String }) p1_name = 'Player 1';
  @property({ type: String }) p2_name = 'Player 2';
  @property({ type: Boolean }) randomize = false;
  @property({ type: Boolean }) p2IsBot = 'false';
  connectedCallback() {
    super.connectedCallback()
    playSound(buttonwav)
    
  }
  render() {
    return html`
      <slot></slot>
      <button @click=${this.onClickBack} part="button" style = "position:relative; right:350px; bottom:95px; height:75px; width:75px">
        Back
      </button>
      <div class="card-deck">
      <div class="card">
          <input type="text" id = "p1_name" style = "position:relative; right:70px; width: 200px; height: 30px; font-size: 16px"  placeholder = "Player 1 Name" @change=${this.onChangeP1Name}/>
          <input type="text" id = "p2_name" style = "position:relative; left:70px; width: 200px; height: 30px; font-size: 16px"  placeholder = "Player 2 Name" @change=${this.onChangeP2Name}/>
        <br>
        <br>
        <h2>Select Who Goes First</h2>
        <input type="radio" id = "p1" style = "position:relative; right:120px" value = "p1" name="firstPlayer"
            ?checked=${this.firstPlayer === 'p1'} @change=${this._onClickRadio}/>
            <label style = "position:relative; right:120px; font-size: 18px; " for="p1"> Player 1 </label>
          <input type="radio" id = "p2" style = "position:relative; left:100px" value = "p2" name="firstPlayer"
            ?checked=${this.firstPlayer === 'p2'} @change=${this._onClickRadio} />
            <label style = "position:relative; left:100px; font-size: 18px; " for= "p2"> Player 2 </label>
        </div>
        <div class="card">
          <button @click=${this.onClickRandom} part="button" style = "position:relative; height:55px;">
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

  private onClickRandom(e: { target: { style: { backgroundColor: string; }  }  }) {
    this.randomize = !this.randomize
    e.target.style.backgroundColor = this.randomize ? buttonColor.Orange : ""
    const radios = this.shadowRoot?.querySelectorAll('[name="firstPlayer"]') as NodeListOf<HTMLElement> | null;
    
    if (radios) {
      radios.forEach((element) => (element as HTMLButtonElement).disabled = this.randomize ? true : false)
    }
  }  

  private onChangeP1Name(e: {target: { value: string; }}){
    this.p1_name = e.target.value
  }

  private onChangeP2Name(e: {target: { value: string; }}){
    this.p2_name = e.target.value
  }

  private onClickBack() {
    window.history.back()

  }


  private _onClickStart() {
    SettingsStore.firstPlayer = this.randomize ? (Math.random() < 0.5 ? 'p1' : 'p2'): this.firstPlayer
    SettingsStore.p1_name = this.p1_name
    SettingsStore.p2_name = this.p2_name
    SettingsStore.curr_game = ''
    SettingsStore.difficulty = ''
    SettingsStore.p2IsBot = this.p2IsBot
    this.navigate("./game")
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
