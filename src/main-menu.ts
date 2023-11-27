import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { getCookie, setCookie } from 'typescript-cookie'

var val = getCookie('volume')
if(typeof val === 'string') {
  var volume = parseFloat(val)
  console.log(volume)
}
else {
  volume = 1
}

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
        <button @click=${this._onClickLocal} part="button" style = "position:relative; right:70px; background:lightblue" >
          Play Local
        </button>
        <button @click=${this._onClickBot} part="button" style = "position:relative; left:70px; background:tomato">
          Play Bot
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

  private _onClickLocal() {
    console.log("Play Local Clicked")
    this.navigate("/game")
  }
  private _onClickBot() {
    console.log("Play Bot Clicked")
    this.navigate("/game")
  }
  private _onClickHelp() {
    console.log("Help Clicked")
    this.navigate("/help")
  }
  private _onClickSettings() {
    console.log("Settings Clicked")
  }
  private navigate(location: string) {
    window.location.href = location
  }



  static styles = css`
    :host {
      max-width: 1280px;
      margin: 0 auto;
      padding: 2rem;
      text-align: center;
    }

    .logo {
      height: 6em;
      padding: 1.5em;
      will-change: filter;
      transition: filter 300ms;
    }
    .logo:hover {
      filter: drop-shadow(0 0 2em #646cffaa);
    }
    .logo.lit:hover {
      filter: drop-shadow(0 0 2em #325cffaa);
    }

    .card {
      padding: 2em;
    }

    .read-the-docs {
      color: #888;
    }

    .h1 {
      font-size: 3.2em;
      line-height: 1.1;
    }

    ::slotted(h1) {
      font-size: 3.2em;
      line-height: 1.1;
    }

    a {
      font-weight: 500;
      color: #646cff;
      text-decoration: inherit;
    }
    a:hover {
      color: #535bf2;
    }

    button {
      border-radius: 8px;
      border: 1px solid transparent;
      //padding: 0.6em 1.2em;
      font-size: 1em;
      font-weight: 500;
      font-family: inherit;
      background-color: #1a1a1a;
      cursor: pointer;
      transition: border-color 0.25s;
      height:150px;
      width:150px;
    }
    button:hover {
      border-color: #646cff;
    }
    button:focus,
    button:focus-visible {
      outline: 4px auto -webkit-focus-ring-color;
    }

    

    @media (prefers-color-scheme: light) {
      a:hover {
        color: #747bff;
      }
      button {
        background-color: #f9f9f9;
      }
    }
  `
}

function playSound(filename: string) {
  var audio = new Audio(filename)
  if (typeof volume === 'number') {
    audio.volume = volume;
  }
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