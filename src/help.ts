import { LitElement, css, html } from 'lit'
import { customElement} from 'lit/decorators.js'
import {playSound} from './main-menu.ts';

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
    'help-page': HelpPage
  }
}

