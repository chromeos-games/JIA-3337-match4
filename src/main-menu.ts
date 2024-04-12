import { LitElement, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { style } from './style'
import { SettingsStore } from './utils/settings-store'
import { buttonColor } from './enums'
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
      <button @click=${this._onClickContinue} part="button" style = "position:relative; right:70px; background:${buttonColor.Green}; color:#242424">
          Continue
        </button>
        <button @click=${this._onClickLocal} part="button" style = "position:relative; left:70px; background:${buttonColor.Yellow}; color:#242424" >
          Play Local
        </button>
        <button @click=${this._onClickBot} part="button" style = "position:relative; left:100px; background:${buttonColor.Red}; color:#242424">
          Play Bot
        </button>

      </div>
      
      <div class="card">
      <button @click=${this._onClickLeaderboard} part="button" style = "position:relative; right:250px; top:50px; height:75px; width:75px;" >
          Records
        </button>  
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
    this.navigate("/game")
  }
  private _onClickLocal() {
    this.navigate("/setup-local")
  }
  private _onClickBot() {
    this.navigate("/setup-bot")
  }
  private _onClickHelp() {
    this.navigate("/help")
  }
  private _onClickSettings() {
    this.navigate("/settings")
  }
  private _onClickLeaderboard() {
    this.navigate("/leaderboard")
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
  });
}

declare global {
  interface HTMLElementTagNameMap {
    'main-menu': MainMenu
  }
}

export {playSound};