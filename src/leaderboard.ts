import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js';
import { style } from './style.ts';
import { Leaderboard } from './utils/leaderboard-store.ts';
import { ReplayStore } from './utils/replay-store.ts';
import { SettingsStore } from './utils/settings-store.ts';

@customElement('leaderboard-page')
export class LeaderboardPage extends LitElement {

  render() {
    return html`
      <slot> </slot>
      <button @click=${this.onClickBack} part="button" style = "position:relative; right:788px; bottom:95px; height:75px; width:75px">
        Back
      </button>
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
      <div class="column" style="width:300px">
        <h2>Watch Replays</h2>
        ${this.getReplayButtons()}
      </div>
      
      <div class="card">
        <button @click=${this._onClickReset} part="button" style = "position:relative" >
          Reset Records
        </button>
      </div>
    `
  }

  updated() {
    this.getRootNode().addEventListener('keydown', (e: Event) => this.keydown(e));
    this.displayLeaderboard()
  }
  private keydown(e: Event) {
    if ((e as KeyboardEvent).code === "Escape" || (e as KeyboardEvent).code === "KeyB") {
      this.onClickBack()
    }
  }
  
  
  private displayLeaderboard() {
    var nameList = "";
    var gamesList = "";
    var winsList = "";
    var winrateList = "";

    var leaderboard = Leaderboard.getLeaderboard()
    console.log(leaderboard)

    var keys = Object.keys(leaderboard).slice(0,15)

    keys.forEach(function (value){
      var games = leaderboard[value]["totalGamesPlayed"]
      var won = leaderboard[value]["gamesWon"]
      
      nameList += value + "\n" + "\n"
      gamesList += games + "\n" + "\n"
      winsList += won + "\n" + "\n"
      winrateList += (Math.round((won * 100 / games))) + "%\n" + "\n"
      
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

  private getReplayButtons() {
    var buttons = []
    var leaderboard = Leaderboard.getLeaderboard()
    var keys = Object.keys(leaderboard).slice(0,15)
    keys.forEach( (value) =>{
      buttons.push(html`<button @click=${() => this._onClickReplay(value)}  style = "height:50px; width:200px" >Replay ${value}'s Most Recent Game</button>`)
    });
    return buttons

  }
  
  private onClickBack() {
    console.log("Back to Main Menu")
    window.location.href = '/'
  }


  private _onClickReset() {
    console.log("Reset Clicked")
    Leaderboard.resetLeaderboard()
    ReplayStore.resetReplays()
  }

  private _onClickReplay(value: string) {
    let allReplays = ReplayStore.getReplays()
    //iterate through array backwards to put most recent games first
    for (let i = allReplays.length - 1; i >= 0; i--) {
      if (allReplays[i][0] === value || allReplays[i][2] === value) {
        SettingsStore.curr_replay = allReplays[i].join("_")
        break
      }
    }
    this.navigate("/replay")
  }
  
  private navigate(location: string) {
    window.location.href = location
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
