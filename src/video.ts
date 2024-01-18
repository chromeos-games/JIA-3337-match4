import { LitElement, css, html } from 'lit'
import { customElement} from 'lit/decorators.js'
import {playSound} from './main-menu.ts';
import { style } from './style.ts';

@customElement('video-page')
export class VideoPage extends LitElement {

  connectedCallback() {
    super.connectedCallback()
    playSound('button.wav')
    
  }

  render() {
    return html`
      <!--<h1 class='h1'>How to Play</h1>-->
      <slot></slot>
      <div class="card">
        <p> Video </p>   
      </div>
      <div class="card">
      <button @click=${this._onClickBack} part="button" style = "position:relative; left:250px; top:50px; height:75px; width:75px">
          Back
      </button>
      </div>
    `
  }

  private _onClickBack() {
    console.log("Back Clicked")
    window.history.back()
  }

  static styles = [style]
}
declare global {
  interface HTMLElementTagNameMap {
    'video-page': VideoPage
  }
}