 import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js';
import { style } from './style.ts';
import { SettingsStore } from './utils/settings-store.ts';

@customElement('setup-local-page')
export class SetupPage extends LitElement {
  @property({ type: String }) firstPlayer = 'p1';
  @property({ type: String }) p1_name = 'Player 1';
  @property({ type: String }) p2_name = 'Player 2';
  @property({ type: Boolean }) randomize = false;
  
  

  render() {
    return html`
      <slot></slot>
      <div class="card-deck">
      <legend>Select Who Goes First</legend>
      <div class="card">
          <input type="text" id = "p1_name" style = "position:relative; right:70px"  placeholder = "Player 1 Name" @change=${this.onChangeP1Name}/>
          <input type="text" id = "p2_name" style = "position:relative; left:70px"  placeholder = "Player 2 Name" @change=${this.onChangeP2Name}/>
        <br>
        <br>
        <input type="radio" id = "p1" style = "position:relative; right:120px" value = "p1" name="firstPlayer"
            ?checked=${this.firstPlayer === 'p1'} @change=${this._onClickRadio}/>
            <label style = "position:relative; right:120px" for="p1"> Player 1 </label>
          <input type="radio" id = "p2" style = "position:relative; left:100px" value = "p2" name="firstPlayer"
            ?checked=${this.firstPlayer === 'p2'} @change=${this._onClickRadio} />
            <label style = "position:relative; left:100px" for= "p2"> Player 2 </label>
          
        </div>
        <div class="card">
          <button @click=${this.onClickRandom} part="button" style = "position:relative; height:55px; background-color: white">
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
    console.log(this.firstPlayer)
  }

  private onClickRandom(e: { target: { style: string; }; }) {
    this.randomize = !this.randomize
    e.target.style = this.randomize ? "position:relative; height:55px; background-color: yellow" : "position:relative; height:55px; background-color: white"
    console.log("randomize: " + this.randomize)
    
  }

  private onChangeP1Name(e: {target: { value: string; }}){
    this.p1_name = e.target.value
    console.log(e.target.value)
  }

  private onChangeP2Name(e: {target: { value: string; }}){
    this.p2_name = e.target.value
    console.log(e.target.value)
  }


  private _onClickStart() {
    console.log("Start Clicked")
    SettingsStore.firstPlayer = this.randomize ? (Math.random() < 0.5 ? 'p1' : 'p2'): this.firstPlayer
    SettingsStore.p1_name = this.p1_name
    SettingsStore.p2_name = this.p2_name
    SettingsStore.curr_game = ''
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
