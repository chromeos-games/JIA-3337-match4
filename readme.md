# Match 4
ChromeOS Game where two players play against each other to create 4 in a row


# Install Guide
## For development
This project runs on [Node.js](https://nodejs.org/en/) with [LitElement](https://lit.dev/) and [Vite](https://vitejs.dev/).

To clone the repo with git, run the following command:
```
git clone https://github.com/chromeos-games/JIA-3337-match4.git
```

You may also download the repo as a zip file using the GitHub repo webpage and extract it to a directory.

Second, install Node.js [here](https://nodejs.org/en/download).

In the Node.js command prompt, navigate to the repo directory and run the following command:
```
npm install
```

After the files needed to the run project are downloaded, run the following command to activate a test build and run the app:
```
npm run dev
```

Running the command should start a webserver for the project and print out the link that you can open in your browser.

## For Deployment
Through Vite, it's possible to build the project into static pages and assets that can be deployed in any hosting service like Netlify or Herkou.

### Manual Building
With Node.js installed according to [their guide](https://nodejs.org/en/download), install the packages by running the following command in the repo directory:
```
npm install
```

Then, build the project by running:
```
npm run build
```

This will generate a directory called dist which should contain static files that can be uploaded at any hosting provider.

### Automatic Deployment
We have included a GitHub workflow for automatic deployment to GitHub pages which we obtained from [Vite's doucumentation](https://vitejs.dev/guide/static-deploy). Please refer to that page for additional information. 

You may clone the repo and push it to your own repository to use the workflow.

Here are the steps to do so:
0. You must have the git command line installed on your machine. You can download it [here](https://git-scm.com/downloads).
1. Create a new repository on GitHub.
2. Go to settings->pages in your repository
3. Set the source to GitHub Actions
4. Clone the repo to your local machine.
```
git clone https://github.com/chromeos-games/JIA-3337-match4.git
```
5. Change the remote URL to your new repository.
Here's an example of how to do it, you may also refer to the [GitHub documentation](https://docs.github.com/en/get-started/getting-started-with-git/managing-remote-repositories) for more information.
```
git remote set-url origin ***your-repository-url***.git
```
6. Push the changes to your repository.
```
git push -u origin main
```

The workflow should automatically deploy the project to GitHub pages. You can access the deployed project by going to the settings->pages in your repository and clicking on the link provided.

## Common Issues

### Node.js not installed
If you encounter an error that says "npm is not recognized as an internal or external command", you may not have Node.js installed on your machine. Please refer to the [Node.js website](https://nodejs.org/en/download) to download and install Node.js.

### Packages installation failed
Please make sure you have an up to date version of Node.js installed on your machine. You can check the version by running the following command:
```
node -v
```
We have tested the project on Node.js version 20.9.0.

If you encounter any issues with the project, please refer to the [Vite documentation](https://vitejs.dev/guide/) or the [LitElement documentation](https://lit.dev/docs/). Please feel free to als o reach out to the developers of the project for assistance.

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
