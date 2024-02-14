import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js';
import {playSound} from './main-menu.ts';
import { style } from './style.ts';
import { SettingsStore } from './utils/settings-store.ts';
import { tokenColor } from './enums.ts';
@customElement('settings-page')
export class SettingsPage extends LitElement {
  @property({ type: tokenColor }) selectedColorPlayer1 = SettingsStore.player1TokenColor;
  @property({ type: tokenColor }) selectedColorPlayer2 = SettingsStore.player2TokenColor;
  
  connectedCallback() {
    super.connectedCallback()
    playSound('button.wav')

  }

  selectColor(player: number, color: tokenColor) {
    // TODO: show a message if the colors are the same
    if (player === 1) {
      if (this.selectedColorPlayer2 === color) {
        return
      }
      this.selectedColorPlayer1 = color;
      SettingsStore.player1TokenColor = color;
    } else if (player === 2) {
      if (this.selectedColorPlayer1 === color) {
        return
      }
      this.selectedColorPlayer2 = color;
      SettingsStore.player2TokenColor = color;
    }
    playSound('button.wav');
  }

  updateSlider(value: number) {
    
    SettingsStore.volume = value
    playSound('button.wav')
  }


    render() {
        return html`
        <h1 class='h1'>Settings</h1>
        <img src="src/assets/volume-off.svg" alt="volume-off" style="width:50px;height:50px;"/>
            <input class="slider" id="vol_input" value=${SettingsStore.volume} type="range" min="0" max="1" step="0.01" @change=${(e: { target: { value: string; }; }) => this.updateSlider(parseFloat(e.target.value))} />
        <img src="src/assets/volume-up.svg" alt="volume-up" style="width:50px;height:50px;"/>
        <div class="card">
        <button @click=${this._onClickBack} part="button" style = "position:relative; left:250px; top:50px; height:75px; width:75px">
          Back
        </button>
        </div>
        <div id="display-message"></div>
        <h2>Player 1 Color:</h2>
    <div class="color-selection">
      ${(Object.keys(tokenColor) as Array<keyof typeof tokenColor>).map(color => html`
        <div class="color-box" 
             style="background-color: ${tokenColor[color]};" 
             @click=${() => this.selectColor(1, tokenColor[color])}
             ?selected=${this.selectedColorPlayer1 === tokenColor[color]}>
        </div>
      `)}
    </div>

    <h2>Player 2 Color:</h2>
    <div class="color-selection">
    ${(Object.keys(tokenColor) as Array<keyof typeof tokenColor>).map(color => html`
    <div class="color-box" 
         style="background-color: ${tokenColor[color]};" 
         @click=${() => this.selectColor(2, tokenColor[color])}
         ?selected=${this.selectedColorPlayer2 === tokenColor[color]}>
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
