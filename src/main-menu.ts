import { LitElement, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { style } from './style'
import { SettingsStore } from './utils/settings-store'

@customElement('main-menu')
export class MainMenu extends LitElement {
  connectedCallback() {
    super.connectedCallback()
    playSound('button.wav')
  }

  render() {
    return html`
      <!--<h1 class='h1'>Match 4</h1>-->
      <slot></slot>
      <div class="card">
        <button @click=${this._onClickLocal} part="button" style = "position:relative; right:70px; background:#ffd740; color:#242424" >
          Play Local
        </button>
        <button @click=${this._onClickBot} part="button" style = "position:relative; left:70px; background:#ff5252; color:#242424">
          Play Bot
        </button>
        <button @click=${this._onClickContinue} part="button" style = "position:relative; left:100px; background:#ff5252; color:#242424">
          Continue
        </button>
      </div>
      
      <div class="card">
        <button @click=${this._onClickHelp} part="button" style = "position:relative; left:250px; top:50px; height:75px; width:75px" >
          Help
        </button>
        <button @click=${this._onClickSettings} part="button" style = "position:relative; left:250px; top:50px; height:75px; width:75px">
          Settings
        </button>
      </div>
    `
  }
  private _onClickContinue() {
    console.log("Continue Clicked")
    this.navigate("/game")
  }
  private _onClickLocal() {
    console.log("Play Local Clicked")
    this.navigate("/setup-local")
  }
  private _onClickBot() {
    console.log("Play Bot Clicked")
    this.navigate("/setup-bot")
  }
  private _onClickHelp() {
    console.log("Help Clicked")
    this.navigate("/help")
  }
  private _onClickSettings() {
    console.log("Settings Clicked")
    this.navigate("/settings")
  }
  private navigate(location: string) {
    window.location.href = location
  }

  static styles = [style]
}

function playSound(filename: string) {
  var audio = new Audio(filename)
  audio.volume = SettingsStore.volume
  audio.play().catch(function(error) {
    console.log(error);
  });
}

declare global {
  interface HTMLElementTagNameMap {
    'main-menu': MainMenu
  }
}

export {playSound};