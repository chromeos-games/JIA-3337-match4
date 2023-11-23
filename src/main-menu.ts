import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('main-menu')
export class MainMenu extends LitElement {
  /**
   * Copy for the read the docs hint.
   */
  @property()
  docsHint = 'Click on the Vite and Lit logos to learn more'

  /**
   * The number of times the button has been clicked.
   */
  @property({ type: Number })
  count = 0

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
  }
  private _onClickBot() {
    console.log("Play Bot Clicked")
  }
  private _onClickHelp() {
    console.log("Help Clicked")
  }
  private _onClickSettings() {
    console.log("Settings Clicked")
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

declare global {
  interface HTMLElementTagNameMap {
    'main-menu': MainMenu
  }
}
