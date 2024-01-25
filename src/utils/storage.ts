import { getCookie, setCookie } from 'typescript-cookie';

export class Storage {
    static get(key: string): string {
        return getCookie(key) || ''
    }
    static set(key: string, value: string): void {
        setCookie(key, value)
    }
}