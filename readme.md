# Match 4
ChromeOS Game where two players play against each other to create 4 in a row


# Install Guide

This project runs on [Node.js](https://nodejs.org/en/) with [LitElement](https://lit.dev/).


First, install Node.js [here](https://nodejs.org/en/download).

In the Node.js command prompt, navigate to the repo directory and run the following command:
```
npm install
```

After the files needed to the run project are downloaded, run the following command to activate a test build and run the app:
```
npm run dev
```



# Release Notes

## Version 0.5.0
### Features
* Keyboard shortcuts added
* Tokens can be played with number keys
* Tokens can be played with arrow keys
* Game can be paused and played with keyboard

### Bug Fixes
* Fixed the continue button showing up when there is no game to continue
* Fixed tutorial not finishing when 4 in a row is achieved
* Fixed the back button and pause button position
* Fixed bot difficulty weights to make their behavior less random

### Known Issues
* Various game replay issues


## Version 0.4.0
### Features
* Game can be paused midgame
* Players can exit out of a game and continue it later
* Leaderboard records player stats
* Game Replays are saved and can be reopened for later viewing

### Bug Fixes
* Fixed the bot not being able to make the first move
* Fixed players naming themselves "Bot" will make the system play for them
* Fixed players being able to make a move for the bot if they click fast enough
* Fixed game drawing if the last move to fill up the board is a winning move
* Fixed random button not working the same for local setup and bot setup

### Known Issues
* Tutorial doesn't finish when 4 in a row is achieved
* Buttons are in unintuitive spots, like the back button and the pause button
* Leaderboard doesn't update when the game is drawed
* Game replay doesn't display names if the winning player replays
* Game replay colors are incorrect if player 2 did not go first
* Game replay sometimes starts with an extra move at 0,0


## Version 0.3.0
### Features
* Players can now play against a bot
* The bot has 3 selectable difficulties: easy, medium, and hard

### Bug Fixes
* Fixed random button functionality when selecting move order
* Fixed difficulty buttons not highlighting when selecting difficulty 
* Fixed tutorial video play button shifting when playing video
* Fixed game not ending when a draw occurs

### Known Issues
* Player naming themselves "Bot" will cause the system to confuse the player for a bot
* If the player clicks too fast, they can make a move for the bot


## Version 0.2.0
### Features
* Game ends when either player reaches 4 in a row and a victory message displays
* Player move order can be selected after pressing play
* Player move order can be randomized if desired
* Player names can be changed
* AI difficulty setting can be changed, but no AI implemented yet
* Games can be paused by leaving the screen and continued by pressing the continue button in the main menu

### Bug Fixes
* Fixed volume slider not playing a test sound when changed
* Fixed scaled game overlapping with text and menu button

### Known Issues
* Randomizing which player goes first doesn't work sometimes 
* Tutorial video play button shifts when playing video


## Version 0.1.0
### Features
* Game board functions and tiles of alternating colors can be stacked on top of each other
* Game tile colors can be changed in settings
* Volume slider functions and sound can be changed in settings
* How to play screen fully filled out with images
* How to play video will play a sample game automatically
* How to play has an option for the user to play a test game
* Storage system with settings persisted in the device (Internal)
  
### Bug Fixes
* N/A

### Known Issues
* Tutorial video play button shifts when playing video
* Volume slider doesn't play a test sound when changed
