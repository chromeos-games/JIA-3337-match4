import Storage from './storage';

export class SettingsStore {
    static get volume(): number {
        return parseFloat(Storage.get('volume')) || 0.5
    }
    static set volume(value: number) {
        // validate sound
        if (typeof value !== 'number' || value < 0 || value > 1) {
            throw new Error('Invalid volume value to set')
        }
        Storage.set('volume', value.toString())
    }
}