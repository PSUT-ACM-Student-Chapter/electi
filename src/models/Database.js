// src/models/Database.js
import { decryptVault, encryptVault } from '../utils/cryptoVault.js';

class ElectiDatabase {
    constructor() {
        this.data = { users: [], teams: [], contests: [] };
        this.isUnlocked = false;
    }

    async unlock(password) {
        try {
            const response = await fetch(`./data/vault.enc?t=${Date.now()}`);
            if (!response.ok) throw new Error("Vault file not found.");
            
            const encryptedData = await response.json();
            const decrypted = await decryptVault(encryptedData, password);
            
            const draft = localStorage.getItem('electi_draft');
            if (draft) {
                this.data = JSON.parse(draft);
                console.log("Loaded unsaved draft from local storage.");
            } else {
                this.data = decrypted;
            }
            
            this.isUnlocked = true;
            return true;
        } catch (error) {
            console.error("Unlock failed:", error);
            return false;
        }
    }

    // NEW: Bypass file loading for fresh setups
    initializeEmpty() {
        const draft = localStorage.getItem('electi_draft');
        if (draft) {
            this.data = JSON.parse(draft);
            console.log("Loaded unsaved draft from local storage.");
        } else {
            this.data = { users: [], teams: [], contests: [] };
        }
        this.isUnlocked = true;
    }

    saveDraft() {
        if (this.isUnlocked) {
            localStorage.setItem('electi_draft', JSON.stringify(this.data));
        }
    }

    clearDraft() {
        localStorage.removeItem('electi_draft');
    }

    async exportVault(password) {
        const encrypted = await encryptVault(this.data, password);
        this.clearDraft();
        return encrypted;
    }
}

export const db = new ElectiDatabase();
