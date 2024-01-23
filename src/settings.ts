import { LitElement, css, html } from 'lit'
import { customElement} from 'lit/decorators.js'
import {playSound} from './main-menu.ts';
import { style } from './style.ts';
import { getCookie, setCookie } from 'typescript-cookie';

@customElement('settings-page')
export class SettingsPage extends LitElement {
  vol = 0.5
  connectedCallback() {
    super.connectedCallback()
    var flatVol = getCookie('volume')
    this.vol = flatVol ? parseFloat(flatVol) : 0.5
    if (typeof this.vol !== 'number' || this.vol < 0 || this.vol > 1) {
      this.vol = 0.5;
    }
    playSound('button.wav')
    
  }

  updateSlider(value: number) {
    setCookie("volume", value.toString());
  }

    render() {
        return html`
        <h1 class='h1'>Settings</h1>
        <img src="src/assets/volume-off.svg" alt="volume-off" style="width:50px;height:50px;"/>
            <input class="slider" id="vol_input" value=${this.vol} type="range" min="0" max="1" step="0.1" @change=${e => this.updateSlider(e.target.value)} />
        <img src="src/assets/volume-up.svg" alt="volume-up" style="width:50px;height:50px;"/>
        <div class="card">
        <button @click=${this._onClickBack} part="button" style = "position:relative; left:250px; top:50px; height:75px; width:75px">
          Back
        </button>
        </div>
        `;
    }

    private _onClickBack() {
        console.log("Back Clicked")
        window.history.back()
      }

    static styles = [style]
  
}

declare global {
    interface HTMLElementTagNameMap {
      'settings-page': SettingsPage
    }
  }
