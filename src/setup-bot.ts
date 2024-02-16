import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js';
import { style } from './style.ts';
import { SettingsStore } from './utils/settings-store.ts';

@customElement('setup-bot-page')
export class SetupPage extends LitElement {
  @property({ type: String }) firstPlayer = 'p1';
  @property({ type: String }) p1_name = 'Player 1';
  @property({ type: String }) p2_name = 'Bot';
  @property({ type: String }) difficulty = 'medium';
  
  

  render() {
    return html`
      <slot></slot>
      <div class="card-deck">
      <input type="text" id = "p1_name" style = "position:relative;"  placeholder = "Player 1 Name" @change=${this.onChangeP1Name}/>
      <div class="card">
      <button @click=${this.onClickEasy} part="button" style = "position:relative; height:125px; width:125px; right:20px; background:lime" > Easy </button>
      <button @click=${this.onClickMedium} part="button" style = "position:relative; height:125px; width:125px; background:yellow" > Medium </button>
      <button @click=${this.onClickHard} part="button" style = "position:relative; height:125px; width:125px; left:20px; background:#ff5252" > Hard </button>
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
    console.log(this.firstPlayer)
  }

  private onClickRandom() {
    this.firstPlayer = Math.random() < 0.5 ? 'p1' : 'p2'
    console.log(this.firstPlayer)
    
  }

  private onChangeP1Name(e: {target: { value: string; }}){
    this.p1_name = e.target.value
    console.log(e.target.value)
  }

  private onClickEasy(){
    this.difficulty = 'easy'
    console.log('easy')
  }
  private onClickMedium(){
    this.difficulty = 'medium'
    console.log("medium")
  }
  private onClickHard(){
    this.difficulty = 'hard'
    console.log('hard')
  }


  private _onClickStart() {
    console.log("Start Clicked")
    SettingsStore.firstPlayer = this.firstPlayer
    SettingsStore.p1_name = this.p1_name
    SettingsStore.p2_name = this.p2_name
    SettingsStore.difficulty = this.difficulty
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
      'setup-bot-page': SetupPage
    }
  }
