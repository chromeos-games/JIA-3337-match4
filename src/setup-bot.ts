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
  @property({ type: Boolean }) randomize = false;
  @property({ type: Object }) easy_button: { style: any; } | undefined;
  @property({ type: Object }) med_button: { style: any; } | undefined;
  @property({ type: Object }) hard_button: { style: any; } | undefined;
  
  

  render() {
    return html`
      <slot></slot>
      <div class="card-deck">
      <input type="text" id = "p1_name" style = "position:relative;"  placeholder = "Player 1 Name" @change=${this.onChangeP1Name}/>
      <div class="card">
      <button @click=${this.onClickEasy} part="button" style = "position:relative; height:125px; width:125px; right:20px; background:white" > Easy </button>
      <button @click=${this.onClickMedium} part="button" style = "position:relative; height:125px; width:125px; background:white" > Medium </button>
      <button @click=${this.onClickHard} part="button" style = "position:relative; height:125px; width:125px; left:20px; background:white" > Hard </button>
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

  private onClickRandom(e: { target: { style: string; }; }) {
    this.randomize = !this.randomize
    e.target.style = this.randomize ? "position:relative; height:55px; background-color: yellow" : "position:relative; height:55px; background-color: white"
    console.log("randomize: " + this.randomize)
    
  }

  private onChangeP1Name(e: {target: { value: string; }}){
    this.p1_name = e.target.value
    console.log(e.target.value)
  }

  private onClickEasy(e: { target: { style: string; }; }){
    this.difficulty = 'easy'
    this.resetButtons()
    e.target.style = "position:relative; height:125px; width:125px; right:20px; background:lime"
    console.log('easy')
    this.easy_button = e.target
  }
  private onClickMedium(e: { target: { style: string; }; }){
    this.difficulty = 'medium'
    this.resetButtons()
    e.target.style = "position:relative; height:125px; width:125px; background:yellow"
    console.log("medium")
    this.med_button = e.target
  }
  private onClickHard(e: { target: { style: string; }; }){
    this.difficulty = 'hard'
    this.resetButtons()
    e.target.style = "position:relative; height:125px; width:125px; left:20px; background:#ff5252"
    console.log('hard')
    this.hard_button = e.target
  }

  private resetButtons(){
    if (this.easy_button != undefined){
      this.easy_button.style = "position:relative; height:125px; width:125px; right:20px; background:white"
    }
    if (this.med_button != undefined){
      this.med_button.style = "position:relative; height:125px; width:125px; background:white"
    }
    if(this.hard_button != undefined){
      this.hard_button.style = "position:relative; height:125px; width:125px; left:20px; background:white"
    }
  }


  private _onClickStart() {
    console.log("Start Clicked")
    SettingsStore.firstPlayer = this.randomize ? (Math.random() < 0.5 ? 'p1' : 'p2'): this.firstPlayer
    SettingsStore.p1_name = this.p1_name
    SettingsStore.p2_name = this.p2_name
    SettingsStore.difficulty = this.difficulty
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
      'setup-bot-page': SetupPage
    }
  }
