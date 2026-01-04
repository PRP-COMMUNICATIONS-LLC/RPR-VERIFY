import { Injectable, inject, signal, computed, effect, untracked } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';

export interface ProjectMetadata {
  project_id: string;
  year: number;
  week: number;
  sequence: number;
}

export interface IntakeFormData {
  lastName: string;
  firstName?: string;
  poiId?: string;
  bsb?: string;
  account?: string;
}

// Global singleton signal - shared across all instances (survives HMR)
// EMERGENCY FIX: Initialize as null, then hydrate asynchronously to prevent blocking bootstrap
const GLOBAL_ACTIVE_PROJECT_ID = signal<string | null>(null);

// Global signal for extracted identity data (for auto-populating intake form)
const GLOBAL_EXTRACTED_IDENTITY = signal<{ firstName: string; lastName: string; idNumber: string } | null>(null);

// Safe Hydration: Defer localStorage read to prevent blocking initial bootstrap
if (typeof window !== 'undefined') {
  // Use requestAnimationFrame to ensure DOM is ready and not block bootstrap
  requestAnimationFrame(() => {
    const storedId = localStorage.getItem('RPR_ACTIVE_PROJECT_ID');
    if (storedId) {
      GLOBAL_ACTIVE_PROJECT_ID.set(storedId);
    }
  });
}

// Global effect flag - stored in window to survive HMR
const getEffectInitialized = (): boolean => {
  if (typeof window === 'undefined') return false;
  return (window as any).__RPR_PROJECT_EFFECT_INITIALIZED === true;
};

const setEffectInitialized = (): void => {
  if (typeof window !== 'undefined') {
    (window as any).__RPR_PROJECT_EFFECT_INITIALIZED = true;
  }
};

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private static readonly STORAGE_KEY = 'RPR_ACTIVE_PROJECT_ID';
  
  private http = inject(HttpClient);
  private firestore = inject(Firestore);
  
  // Cloud Function URL - Update this to your deployed function URL
  // For local testing, use: http://localhost:8080/generate_project_id
  // For production, use: https://asia-southeast1-{PROJECT_ID}.cloudfunctions.net/generate_project_id
  private readonly PROJECT_ID_API_URL = 
    'https://asia-southeast1-rpr-verify-b.cloudfunctions.net/generate_project_id';
  
  // Public read-only access to the Project ID - uses global signal
  readonly activeProjectId = computed(() => {
    return GLOBAL_ACTIVE_PROJECT_ID();
  });
  
  // Backward compatibility: Provide currentId for components expecting IdentityService pattern
  readonly currentId = computed(() => GLOBAL_ACTIVE_PROJECT_ID() ?? 'NO_ID');
  
  constructor() {
    // NUCLEAR CLEANUP: Clear localStorage once on first service instantiation to remove "poisoned" IDs from old builds
    if (typeof window !== 'undefined' && !(window as any).__RPR_PROJECT_CLEANUP_DONE) {
      const oldId = localStorage.getItem(ProjectService.STORAGE_KEY);
      if (oldId) {
        console.log('[PROJECT SERVICE] Clearing stale localStorage project ID:', oldId);
        localStorage.removeItem(ProjectService.STORAGE_KEY);
        GLOBAL_ACTIVE_PROJECT_ID.set(null);
      }
      (window as any).__RPR_PROJECT_CLEANUP_DONE = true;
    }
    
    // Global effect pattern: Only initialize effect once, even across HMR reloads
    if (!getEffectInitialized()) {
      setEffectInitialized();
      
      // Effect: Automatically sync state to storage whenever it changes
      // Circuit Breaker: Wrap localStorage operations in untracked() to prevent recursive updates
      // Effect tracks the global signal (shared across all instances)
      effect(() => {
        // Track the global signal (shared across all instances)
        const id = GLOBAL_ACTIVE_PROJECT_ID();
        untracked(() => {
          if (id && typeof window !== 'undefined') {
            localStorage.setItem(ProjectService.STORAGE_KEY, id);
          } else if (typeof window !== 'undefined') {
            localStorage.removeItem(ProjectService.STORAGE_KEY);
          }
        });
      });
    }
  }
  
  /**
   * Generate a new project ID and store it as the active project
   * @param formData Intake form data containing lastName and optional fields
   * @returns Promise resolving to the generated project ID
   */
  async generateProjectId(formData: IntakeFormData): Promise<string> {
    try {
      const response = await this.http.post<ProjectMetadata>(
        this.PROJECT_ID_API_URL,
        {
          last_name: formData.lastName,
          first_name: formData.firstName || '',
          poi_id: formData.poiId || '',
          bsb: formData.bsb || '',
          account: formData.account || '',
          reference_date: new Date().toISOString().split('T')[0] // YYYY-MM-DD format
        }
      ).toPromise();
      
      if (!response || !response.project_id) {
        throw new Error('Invalid response from project ID generator');
      }
      
      // Update the global signal (shared across all instances)
      GLOBAL_ACTIVE_PROJECT_ID.set(response.project_id);
      
      console.log(`[PROJECT SERVICE] Project ID Generated: ${response.project_id}`);
      
      return response.project_id;
    } catch (error) {
      console.error('[PROJECT SERVICE] Error generating project ID:', error);
      throw error;
    }
  }
  
  /**
   * Reset the active project (clears state and localStorage)
   */
  resetProject(): void {
    // Update the global signal (shared across all instances)
    GLOBAL_ACTIVE_PROJECT_ID.set(null);
    console.log('[PROJECT SERVICE] Project reset');
  }
  
  /**
   * Set an existing project ID (for loading from storage or external source)
   */
  setActiveProjectId(projectId: string): void {
    // Update the global signal (shared across all instances)
    GLOBAL_ACTIVE_PROJECT_ID.set(projectId);
  }
  
  /**
   * Check if a project is currently active
   */
  hasActiveProject(): boolean {
    return GLOBAL_ACTIVE_PROJECT_ID() !== null;
  }
  
  /**
   * Get extracted identity data (for auto-populating intake form)
   */
  readonly extractedIdentity = computed(() => GLOBAL_EXTRACTED_IDENTITY());
  
  /**
   * Set extracted identity data (called by dropzone after extraction)
   */
  setExtractedIdentity(identity: { firstName: string; lastName: string; idNumber: string } | null): void {
    GLOBAL_EXTRACTED_IDENTITY.set(identity);
  }
}
