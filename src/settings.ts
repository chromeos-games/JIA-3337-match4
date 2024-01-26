import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js';
import {playSound} from './main-menu.ts';
import { style } from './style.ts';
import { SettingsStore } from './utils/settings-store.ts';


const availableColors = [
  { name: 'Red', value: '#ff0000' },
  { name: 'Green', value: '#00ff00' },
  { name: 'Blue', value: '#0000ff' },
  { name: 'Orange', value: '#ffa500' },
  { name: 'Brown', value: '#a52a2a' },
  { name: 'White', value: '#ffffff' }
];


@customElement('settings-page')
export class SettingsPage extends LitElement {
  @property({ type: String }) selectedColorPlayer1 = getCookie('player1Color') || '#ff0000';
  @property({ type: String }) selectedColorPlayer2 = getCookie('player2Color') || '#ffd740';
  
  vol = 0.5
  connectedCallback() {
    super.connectedCallback()
    playSound('button.wav')

  }

  

  selectColor(player: string, color: string) {
    if (player === 'player1') {
      this.selectedColorPlayer1 = color;
      setCookie('player1Color', color);
    } else if (player === 'player2') {
      this.selectedColorPlayer2 = color;
      setCookie('player2Color', color);
    }
    playSound('button.wav');
  }

  

  selectColor(player: string, color: string) {
    if (player === 'player1') {
      this.selectedColorPlayer1 = color;
      setCookie('player1Color', color);
    } else if (player === 'player2') {
      this.selectedColorPlayer2 = color;
      setCookie('player2Color', color);
    }
    playSound('button.wav');
  }

  updateSlider(value: number) {
    SettingsStore.volume = value
  }


    render() {
        return html`
        <h1 class='h1'>Settings</h1>
        <img src="src/assets/volume-off.svg" alt="volume-off" style="width:50px;height:50px;"/>
            <input class="slider" id="vol_input" value=${SettingsStore.volume} type="range" min="0" max="1" step="0.1" @change=${e => this.updateSlider(parseFloat(e.target.value))} />
        <img src="src/assets/volume-up.svg" alt="volume-up" style="width:50px;height:50px;"/>
        <div class="card">
        <button @click=${this._onClickBack} part="button" style = "position:relative; left:250px; top:50px; height:75px; width:75px">
          Back
        </button>
        </div>
        <h2>Player 1 Color:</h2>
    <div class="color-selection">
      ${availableColors.map(color => html`
        <div class="color-box" 
             style="background-color: ${color.value};" 
             @click=${() => this.selectColor('player1', color.value)}
             ?selected=${this.selectedColorPlayer1 === color.value}>
        </div>
      `)}
    </div>

    <h2>Player 2 Color:</h2>
    <div class="color-selection">
      ${availableColors.map(color => html`
        <div class="color-box" 
             style="background-color: ${color.value};" 
             @click=${() => this.selectColor('player2', color.value)}
             ?selected=${this.selectedColorPlayer2 === color.value}>
        </div>
      `)}
    </div>
  `;
        
    }
    

    private _onClickBack() {
        console.log("Back Clicked")
        window.history.back()
      }

      static styles = [style, css`
      .color-box {
        display: inline-block;
        width: 50px;
        height: 50px;
        margin: 5px;
        border: 2px solid transparent;
        cursor: pointer;
      }
  
      .color-box[selected] {
        border: 5px solid black;
        
    `];
  
}

declare global {
    interface HTMLElementTagNameMap {
      'settings-page': SettingsPage
    }
  }
