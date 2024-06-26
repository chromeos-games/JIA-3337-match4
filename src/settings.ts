import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js';
import {playSound} from './main-menu.ts';
import { style } from './style.ts';
import { SettingsStore } from './utils/settings-store.ts';
import { tokenColor } from './enums.ts';
import volume_up from './assets/volume-up.png';
import volume_off from './assets/volume-off.png';
import buttonwav from '../button.wav'
@customElement('settings-page')
export class SettingsPage extends LitElement {
  @property({ type: tokenColor }) selectedColorPlayer1 = SettingsStore.player1TokenColor;
  @property({ type: tokenColor }) selectedColorPlayer2 = SettingsStore.player2TokenColor;
  
  connectedCallback() {
    super.connectedCallback()
    playSound(buttonwav)

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
    playSound(buttonwav);
  }

  updateSlider(value: number) {
    
    SettingsStore.volume = value
    playSound(buttonwav)
  }

  updateScale(value: number) {
    SettingsStore.scale = value
  }
    render() {
        return html`
          <button @click=${this._onClickBack} part="button" style = "position:relative; right:360px; top:130px; height:75px; width:75px">
            Back
          </button>
        <h1 class='h1'>Settings</h1>
        <img src=${volume_off} alt="volume-off" style="width:40px;height:40px;"/>
            <input class="slider" id="vol_input" value=${SettingsStore.volume} type="range" min="0" max="1" step="0.01" @change=${(e: { target: { value: string; }; }) => this.updateSlider(parseFloat(e.target.value))} />
        <img src=${volume_up} alt="volume-up" style="width:40px;height:40px;"/>
  
        <div id="display-message"></div>
    <h2>Game Scale:
    <input class="slider" id="scale_input" value=${SettingsStore.scale} type="range" min="0.5" max="1.5" step="0.01" @change=${(e: { target: { value: string; }; }) => this.updateScale(parseFloat(e.target.value))} />
    </h2>
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
    
    updated() {
      this.getRootNode().addEventListener('keydown', (e: Event) => this.keydown(e));
    }
    private keydown(e: Event) {
      if ((e as KeyboardEvent).code === "Escape" || (e as KeyboardEvent).code === "KeyB") {
        this._onClickBack()
      }
    }

    private _onClickBack() {
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
