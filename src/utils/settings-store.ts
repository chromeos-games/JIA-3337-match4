import {Storage} from './storage';
import {tokenColor} from '../enums';
  
export class SettingsStore {
    static get volume(): number {
        return parseFloat(Storage.get('volume')) || 0.5
    }
    static set volume(value: number) {
        // validate sound
        if (typeof value !== 'number' || value < 0 || value > 1) {
            throw new Error('Invalid volume value to set: ' + value)
        }
        Storage.set('volume', value.toString())
    }

    static get player1TokenColor(): tokenColor {
        return Storage.get('player1TokenColor') as tokenColor || tokenColor.Red
    }

    static set player1TokenColor(value: tokenColor) {
        if (this.player2TokenColor === value) {
            throw new Error('Tried to set player1TokenColor to the same value as player2TokenColor')
        }
        Storage.set('player1TokenColor', value)
    }

    static get player2TokenColor(): tokenColor {
        return Storage.get('player2TokenColor') as tokenColor || tokenColor.Green
    }

    static set player2TokenColor(value: tokenColor) {
        if (this.player1TokenColor === value) {
            throw new Error('Tried to set player2TokenColor to the same value as player1TokenColor')
        }
        Storage.set('player2TokenColor', value)
    }

}