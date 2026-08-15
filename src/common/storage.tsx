"use client"

interface GameEvent {
    set(key: string, value: any): void;
    get(key: string): string | null;
    setBool(key: string, value: boolean): void;
    getBool(key: string): boolean | null;
    setNumber(key: string, value: number): void;
    getNumber(key: string): number | null;
}

const GameEvent: GameEvent = {
    set(key: string, value: any): void {
        if (typeof window === "undefined") return;
        localStorage.setItem(key, value.toString())  
    },
    get(key: string): string | null {
        if (typeof window === "undefined") return null;
        return localStorage.getItem(key);
    },
    setBool(key: string, value: boolean): void {
        GameEvent.set(key, value);
    },
    getBool(key: string): boolean | null {
        let value = GameEvent.get(key);
        if (value === null) return null;
        switch (value.toLowerCase()) {
            case "true": return true;
            case "false": return false;
            default: return null;
        }
    },
    setNumber(key: string, value: number): void {
        GameEvent.set(key, value);
    },
    getNumber(key: string): number | null {
        let value = GameEvent.get(key);
        if (value === null) return null;
        let num = Number(value);
        if (!Number.isFinite(num)) return null;
        return num;
    }
};

export default GameEvent;