 import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js';
import { style } from './style.ts';
import { SettingsStore } from './utils/settings-store.ts';
import { buttonColor } from './enums.ts';

@customElement('setup-local-page')
export class SetupPage extends LitElement {
  @property({ type: String }) firstPlayer = 'p1';
  @property({ type: String }) p1_name = 'Player 1';
  @property({ type: String }) p2_name = 'Player 2';
  @property({ type: Boolean }) randomize = false;
  @property({ type: Boolean }) p2IsBot = 'false';

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
          <button @click=${this.onClickRandom} part="button" style = "position:relative; height:55px; background-color: ${buttonColor.Green}">
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
  private _onClickRadio(e: { target: { value: string; }; }) {
    this.firstPlayer = e.target.value
    console.log(this.firstPlayer)
  }

  private onClickRandom() {
    // Randomly choose between 'p1' and 'p2' and set as firstPlayer
    this.firstPlayer = Math.random() < 0.5 ? 'p1' : 'p2';
  
    // Force a refresh of the radio buttons by changing an attribute
    this.refreshRadioButtons();
  
    
    const buttonColor = this.randomize ? 'green' : 'red';
    this.randomize = !this.randomize; // Toggle the randomize property
    this.updateButtonColor(buttonColor);
    
   
    this.requestUpdate();
    console.log("First Player: " + this.firstPlayer)
  }
  
  private refreshRadioButtons() {
    
    const p1Radio = this.shadowRoot?.querySelector('#p1') as HTMLInputElement;
    const p2Radio = this.shadowRoot?.querySelector('#p2') as HTMLInputElement;
  
    if (p1Radio && p2Radio) {
      
      const refreshValue = (p1Radio.getAttribute('data-refresh') || 'false') === 'false' ? 'true' : 'false';
      p1Radio.setAttribute('data-refresh', refreshValue);
      p2Radio.setAttribute('data-refresh', refreshValue);
  
      
      p1Radio.checked = this.firstPlayer === 'p1';
      p2Radio.checked = this.firstPlayer === 'p2';
    }
  }
  
  private updateButtonColor(color: string) {
    // Directly update the button color via shadow DOM, ensuring the element is an HTMLElement
    const button = this.shadowRoot?.querySelector('button[part="button"]') as HTMLElement | null;
    if (button) {
      button.style.backgroundColor = color;
    }
  }

  private onChangeP1Name(e: {target: { value: string; }}){
    this.p1_name = e.target.value
    console.log(e.target.value)
  }

  private onChangeP2Name(e: {target: { value: string; }}){
    this.p2_name = e.target.value
    console.log(e.target.value)
  }

  private onClickBack() {
    console.log("Back to Main Menu")
    window.location.href = '/'
  }


  private _onClickStart() {
    console.log("Start Clicked")
    SettingsStore.firstPlayer = this.randomize ? (Math.random() < 0.5 ? 'p1' : 'p2'): this.firstPlayer
    SettingsStore.p1_name = this.p1_name
    SettingsStore.p2_name = this.p2_name
    SettingsStore.curr_game = ''
    SettingsStore.difficulty = ''
    SettingsStore.p2IsBot = this.p2IsBot
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
