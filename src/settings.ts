import { LitElement, css, html } from 'lit'
import { customElement} from 'lit/decorators.js'
import {playSound} from './main-menu.ts';
import { style } from './style.ts';

@customElement('settings-page')
export class SettingsPage extends LitElement {

  connectedCallback() {
    super.connectedCallback()
    playSound('button.wav')
    
  }

    render() {
        return html`
        <h1 class='h1'>Settings</h1>
        <img src="src/assets/volume-off.svg" alt="volume-off" style="width:50px;height:50px;"/>
            <input class="slider" id="vol_input" type="range" min="0" max="100" step="1" />
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
