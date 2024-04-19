import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        game: resolve(__dirname, 'game.html'),
        help: resolve(__dirname, 'help.html'),
        leaderboard: resolve(__dirname, 'leaderboard.html'),
        replay: resolve(__dirname, 'replay.html'),
        settings: resolve(__dirname, 'settings.html'),
        setup_bot: resolve(__dirname, 'setup-bot.html'),
        setup_local: resolve(__dirname, 'setup-local.html'),
        tutorial: resolve(__dirname, 'tutorial.html'),
        video: resolve(__dirname, 'video.html'),
      },
    },
  },
})