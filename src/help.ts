import { LitElement, css, html } from 'lit'
import { customElement} from 'lit/decorators.js'
import {playSound} from './main-menu.ts';
import { style } from './style.ts';

@customElement('help-page')
export class HelpPage extends LitElement {

  connectedCallback() {
    super.connectedCallback()
    playSound('button.wav')
    
  }

  render() {
    return html`
      <!--<h1 class='h1'>How to Play</h1>-->
      <slot></slot>
      <div class="card">
      <button @click=${this._onClickVideo} part="button" style = "position:relative; right:70px">
          Watch Video
      </button>
      <button @click=${this._onClickTutorial} part="button" style = "position:relative; left:70px">
          Play Tutorial
      </button>
      </div>  
      <div class="card">
        <p> Two players will alternate turns. Click on a column to drop you color disc into that column of the game board.
          The first player to match four in a row of their color discs is the winner. </p>
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

  private _onClickTutorial() {
    console.log("Tutorial Clicked")
    this.navigate("/tutorial")
  }

  private _onClickVideo() {
    console.log("Video Clicked")
    this.navigate("/video")
  }

  private navigate(location: string) {
    window.location.href = location
  }

  static styles = [style]
}
declare global {
  interface HTMLElementTagNameMap {
    'help-page': HelpPage
  }
}

