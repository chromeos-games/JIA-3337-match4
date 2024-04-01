 import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js';
import { style } from './style.ts';
import { Leaderboard } from './utils/leaderboard-store.ts';
import { buttonColor } from './enums.ts';

@customElement('leaderboard-page')
export class LeaderboardPage extends LitElement {

  render() {
    return html`
      <slot></slot>
      <div class="column" style="width:300px">
          <h2>Player Name</h2>
          <p name="name"></p>
      </div>
      <div class="column" style="width:100px">
          <h2>Games</h2>
          <p name="games"></p>
      </div>
      <div class="column" style="width:100px">
          <h2>Wins</h2>
          <p name="wins"></p>
      </div>
      <div class="column" style="width:100px">
          <h2>Winrate</h2>
          <p name="winrate"></p>
      </div>
      
      <div class="card">
        <button @click=${this.onClickBack} part="button" style = "position:relative; margin-right: 20px" >
          Back
        </button>
        <button @click=${this._onClickReset} part="button" style = "position:relative" >
          Reset Records
        </button>
      </div>
    `
  }

  updated() {
    this.displayLeaderboard()
  }
  
  
  private displayLeaderboard() {
    var nameList = "";
    var gamesList = "";
    var winsList = "";
    var winrateList = "";

    var leaderboard = Leaderboard.getLeaderboard()

    var keys = Object.keys(leaderboard).slice(0,15)

    console.log(leaderboard)

    keys.forEach(function (value){
      var games = leaderboard[value]["totalGamesPlayed"]
      var won = leaderboard[value]["gamesWon"]
      
      nameList += value + "\n"
      gamesList += games + "\n"
      winsList += won + "\n"
      winrateList += (Math.round((won * 100 / games))) + "%\n"
      
    });
    
    const name = this.shadowRoot?.querySelector('[name="name"]') as HTMLElement | null
    if (name) {
      name.textContent = nameList;
    }
    const games = this.shadowRoot?.querySelector('[name="games"]') as HTMLElement | null
    if (games) {
      games.textContent = gamesList;
    }
    const wins = this.shadowRoot?.querySelector('[name="wins"]') as HTMLElement | null
    if (wins) {
      wins.textContent = winsList;
    }
    const winrate = this.shadowRoot?.querySelector('[name="winrate"]') as HTMLElement | null
    if (winrate) {
      winrate.textContent = winrateList;
    }
  }
  
  private onClickBack() {
    console.log("Back to Main Menu")
    window.location.href = '/'
  }


  private _onClickReset() {
    console.log("Reset Clicked")
    Leaderboard.resetLeaderboard()
  }
  

  static styles = [style, css`
    .selected {
      border-color: #646cff;
    }
  `]

}

declare global {
    interface HTMLElementTagNameMap {
      'leaderboard-page': LeaderboardPage
    }
  }
