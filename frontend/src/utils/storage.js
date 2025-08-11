// src/utils/storage.js - Professional App State Management
export class AppState {
    constructor() {
        this.state = {};
        this.listeners = [];
        this.storageKey = 'hackathon_app_state';
        this.init();
    }

    init() {
        this.loadFromStorage();
        this.setupStorageListener();
    }

    setState(updates, persist = true) {
        const prevState = { ...this.state };
        this.state = { ...this.state, ...updates };

        if (persist) {
            this.saveToStorage();
        }

        this.notifyListeners(prevState, this.state);
        this.dispatchEvent('stateChange', { prevState, newState: this.state });
    }

    getState() {
        return { ...this.state };
    }

    subscribe(listener) {
        this.listeners.push(listener);

        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    notifyListeners(prevState, newState) {
        this.listeners.forEach(listener => {
            try {
                listener(newState, prevState);
            } catch (error) {
                console.error('State listener error:', error);
            }
        });
    }

    dispatchEvent(eventName, detail) {
        const event = new CustomEvent(eventName, { detail });
        window.dispatchEvent(event);
    }

    loadFromStorage() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                const parsed = JSON.parse(stored);
                if (parsed && typeof parsed === 'object') {
                    this.state = parsed;
                }
            }
        } catch (error) {
            console.error('Failed to load state from storage:', error);
        }
    }

    saveToStorage() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.state));
        } catch (error) {
            console.error('Failed to save state to storage:', error);
        }
    }

    setupStorageListener() {
        window.addEventListener('storage', (event) => {
            if (event.key === this.storageKey && event.newValue) {
                try {
                    const newState = JSON.parse(event.newValue);
                    const prevState = { ...this.state };
                    this.state = newState;
                    this.notifyListeners(prevState, this.state);
                } catch (error) {
                    console.error('Failed to sync state from storage:', error);
                }
            }
        });
    }

    get(key, defaultValue = null) {
        return key.split('.').reduce((obj, k) => obj && obj[k], this.state) || defaultValue;
    }

    set(key, value, persist = true) {
        const keys = key.split('.');
        const updates = {};
        let current = updates;

        keys.forEach((k, index) => {
            if (index === keys.length - 1) {
                current[k] = value;
            } else {
                current[k] = {};
                current = current[k];
            }
        });

        this.setState(updates, persist);
    }

    clear(persist = true) {
        const prevState = { ...this.state };
        this.state = {};

        if (persist) {
            this.saveToStorage();
        }

        this.notifyListeners(prevState, this.state);
    }
}