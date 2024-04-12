import { LitElement, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { playSound } from './main-menu.ts';
import { style } from './style.ts';

@customElement('help-page')
export class HelpPage extends LitElement {

  connectedCallback() {
    super.connectedCallback()
    playSound('button.wav')
    
  }

  render() {
    return html`
    <div class="card">
      <button @click=${this._onClickBack} part="button" style = "position:relative; right:450px; top:135px; height:75px; width:75px">
        Back
      </button>
    </div>
      <!--<h1 class='h1'>How to Play</h1>-->
      <slot></slot>
      <div class="card">
       <img src="images//tutorial_image_1.png" alt="Tutorial 1" style="position:relative; right:20px; width:301.5px;height:267.75px;"> 
       <img src="images//tutorial_image_2.png" alt="Tutorial 2" style="position:relative; width:301.5px;height:267.75px;"> 
       <img src="images//tutorial_image_3.png" alt="Tutorial 3" style="position:relative; left:20px; width:301.5px;height:267.75px;">
       <br> 
       
       <p> Select a Column! &emsp; &emsp; &emsp; &emsp; &emsp; &emsp; &emsp; &emsp;  
        Block Opponent's Victory! &emsp; &emsp; &emsp; &emsp; &emsp; &emsp; &emsp; &emsp; &emsp; 
        Match 4 in a Row! </p>
      </div>  
      
      <div class="card">
        <p> Two players will alternate turns. <br>
          Click on a column to drop you color disc into that column of the game board. <br>
          The first player to match four in a row of their color discs is the winner. </p>
      
      <button @click=${this._onClickVideo} part="button" style = "position:relative; right:30px; height:120px; width:150px">
          Watch Video
      </button>
      <button @click=${this._onClickTutorial} part="button" style = "position:relative; left:30px; height:120px; width:150px">
          Play Tutorial
      </button>

      </div>

    `
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

