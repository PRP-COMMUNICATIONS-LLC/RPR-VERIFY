import { Injectable, signal, computed, effect } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class IdentityService {
    private readonly STORAGE_KEY = 'RPR_ACTIVE_ID';

    // The Global Source of Truth - Initialize from LocalStorage if it exists
    private _currentUserId = signal<string | null>(localStorage.getItem(this.STORAGE_KEY));

    // Public read-only access to the ID
    readonly currentUserId = computed(() => this._currentUserId());

    // Sovereign Sentinel State (for future escalation features)
    private _isEscalated = signal(false);
    readonly isEscalated = this._isEscalated.asReadonly();

    // Core Identity Logic (backward compatibility)
    private _dossier = signal<any>(null);
    readonly currentDossier = this._dossier.asReadonly();
    readonly currentId = computed(() => this._currentUserId() ?? 'NO_ID');

    constructor() {
        // Effect: Automatically sync state to storage whenever it changes
        effect(() => {
            const id = this._currentUserId();
            if (id) {
                localStorage.setItem(this.STORAGE_KEY, id);
            } else {
                localStorage.removeItem(this.STORAGE_KEY);
            }
        });
    }

    // ID Genesis Trigger: Standardized format [LASTNAME/YEAR/WK]
    generateGenesisId(lastName: string) {
        const year = 2025;
        const week = 52;
        const formattedId = `${lastName.toUpperCase()}/${year}/WK${week}`;
        
        this._currentUserId.set(formattedId);
        
        // Update dossier for backward compatibility
        this._dossier.set({
            userId: formattedId,
            lastName: lastName.toUpperCase(),
            year: year,
            week: week,
            isEscalated: false
        });
        
        console.log(`[IDENTITY SYSTEM] Genesis ID Locked: ${formattedId}`);
    }

    // Global Reset: Returns all tabs to "Waiting for Ingestion" state
    resetIdentity() {
        this._currentUserId.set(null);
        this._dossier.set(null);
        this._isEscalated.set(false);
    }

    // Backward compatibility methods
    updateDossier(data: any) {
        this._dossier.set(data);
        if (data?.userId) {
            this._currentUserId.set(data.userId);
        }
        if (data && typeof data.isEscalated === 'boolean') {
            this._isEscalated.set(data.isEscalated);
        }
    }

    setDossier(data: any) {
        this.updateDossier(data);
    }

    // Trigger for the Sentinel Red transition
    toggleEscalation() {
        this._isEscalated.update(v => !v);
    }

    // Public API for Red-Alert button: Activates global escalation state
    triggerAlert() {
        console.warn("🚨 Sovereign Red-Alert Activated");
        this._isEscalated.set(true);
        
        // Also update dossier for backward compatibility
        const currentDossier = this._dossier();
        if (currentDossier) {
            this._dossier.set({ ...currentDossier, isEscalated: true });
        }
    }
}
