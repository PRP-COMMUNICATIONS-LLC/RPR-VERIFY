import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

declare const gapi: any;

/**
 * Custom error class for Google Drive API errors
 */
export class DriveApiError extends Error {
  constructor(
    message: string,
    public code: string,
    public status?: number
  ) {
    super(message);
    this.name = 'DriveApiError';
  }
}

@Injectable({
  providedIn: 'root'
})
export class GoogleDriveService {
  private gapiLoaded = false;
  private authInstance: any = null;
  private clientInitialized = false;

  /**
   * Initialize Google API client
   */
  async initialize(): Promise<void> {
    if (this.clientInitialized) {
      return;
    }

    // Load GAPI script if not already loaded
    if (!this.gapiLoaded) {
      await this.loadGapiScript();
    }

    // Initialize client
    await new Promise<void>((resolve, reject) => {
      gapi.load('client:auth2', async () => {
        try {
          await gapi.client.init({
            clientId: environment.googleDrive.clientId,
            discoveryDocs: environment.googleDrive.discoveryDocs,
            scope: environment.googleDrive.scopes.join(' ')
          });

          this.authInstance = gapi.auth2.getAuthInstance();
          this.clientInitialized = true;
          resolve();
        } catch (error: any) {
          console.error('GAPI initialization error:', error);
          reject(new DriveApiError(
            'Failed to initialize Google Drive API',
            'INIT_ERROR',
            error.status
          ));
        }
      });
    });
  }

  /**
   * Load Google API script dynamically
   */
  private loadGapiScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (document.querySelector('script[src*="apis.google.com/js/api.js"]')) {
        this.gapiLoaded = true;
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => {
        this.gapiLoaded = true;
        resolve();
      };
      script.onerror = () => {
        reject(new DriveApiError('Failed to load Google API script', 'SCRIPT_LOAD_ERROR'));
      };
      document.head.appendChild(script);
    });
  }

  /**
   * Ensure user is signed in to Google Drive
   */
  async ensureSignedIn(): Promise<void> {
    if (!this.clientInitialized) {
      await this.initialize();
    }

    if (!this.authInstance) {
      throw new DriveApiError('Google Drive API not initialized', 'NOT_INITIALIZED');
    }

    const isSignedIn = this.authInstance.isSignedIn.get();
    if (!isSignedIn) {
      try {
        await this.authInstance.signIn();
      } catch (error: any) {
        if (error.error === 'popup_closed_by_user') {
          throw new DriveApiError('Sign-in was cancelled', 'USER_CANCELLED');
        }
        throw new DriveApiError(
          'Failed to sign in to Google Drive',
          'SIGN_IN_ERROR',
          error.status
        );
      }
    }
  }

  /**
   * Get access token for Google Drive API
   */
  private getAccessToken(): string {
    if (!this.authInstance) {
      throw new DriveApiError('Not signed in to Google Drive', 'NOT_SIGNED_IN');
    }

    const user = this.authInstance.currentUser.get();
    const authResponse = user.getAuthResponse(true);
    return authResponse.access_token;
  }

  /**
   * Upload a file to Google Drive
   */
  async uploadFile(file: File, folderId?: string): Promise<unknown> {
    await this.ensureSignedIn();

    try {
      const metadata: Record<string, unknown> = {
        name: file.name,
        mimeType: file.type
      };

      if (folderId) {
        metadata['parents'] = [folderId];
      }

      const form = new FormData();
      form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
      form.append('file', file);

      const accessToken = this.getAccessToken();
      const response = await fetch(
        'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`
          },
          body: form
        }
      );

      if (!response.ok) {
        await this.handleApiError(response, 'UPLOAD_ERROR');
      }

      return await response.json();
    } catch (error: unknown) {
      if (error instanceof DriveApiError) {
        throw error;
      }
      const msg = (error as any)?.message ?? String(error);
      throw new DriveApiError(
        `Failed to upload file: ${msg}`,
        'UPLOAD_ERROR'
      );
    }
  }

  /**
   * List files in Google Drive
   */
  async listFiles(folderId?: string): Promise<unknown[]> {
    await this.ensureSignedIn();

    try {
      let query = "trashed=false";
      if (folderId) {
        query += ` and '${folderId}' in parents`;
      }

      const response = await gapi.client.drive.files.list({
        q: query,
        fields: 'files(id, name, mimeType, size, modifiedTime, webViewLink)',
        pageSize: 100
      });

      return response.result.files || [];
    } catch (error: unknown) {
      await this.handleApiError(error as any, 'LIST_ERROR');
      return [];
    }
  }

  /**
   * Create a folder in Google Drive
   */
  async createFolder(name: string, parentId?: string): Promise<unknown> {
    await this.ensureSignedIn();

    try {
      const metadata: Record<string, unknown> = {
        name: name,
        mimeType: 'application/vnd.google-apps.folder'
      };

      if (parentId) {
        metadata['parents'] = [parentId];
      }

      const response = await gapi.client.drive.files.create({
        resource: metadata,
        fields: 'id, name, webViewLink'
      });

      return response.result;
    } catch (error: unknown) {
      await this.handleApiError(error as any, 'CREATE_FOLDER_ERROR');
      throw error;
    }
  }

  /**
   * Delete a file from Google Drive
   */
  async deleteFile(fileId: string): Promise<void> {
    await this.ensureSignedIn();

    try {
      await gapi.client.drive.files.delete({
        fileId: fileId
      });
    } catch (error: any) {
      await this.handleApiError(error, 'DELETE_ERROR');
      throw error;
    }
  }

  /**
   * Handle API errors with proper error codes
   */
  private async handleApiError(error: any, defaultCode: string): Promise<never> {
    let status: number | undefined;
    let message = 'An error occurred';
    let code = defaultCode;

    if (error.status) {
      status = error.status;
    } else if (error.result?.error) {
      status = error.result.error.code;
      message = error.result.error.message;
    } else if (error instanceof Response) {
      status = error.status;
      try {
        const errorData = await error.json();
        message = errorData.error?.message || message;
      } catch {
        message = error.statusText || message;
      }
    } else {
      message = error.message || message;
    }

    // Map HTTP status codes to error codes
    switch (status) {
      case 401:
        code = 'UNAUTHORIZED';
        message = 'Authentication failed. Please sign in again.';
        break;
      case 404:
        code = 'NOT_FOUND';
        message = 'Resource not found.';
        break;
      case 403:
        code = 'FORBIDDEN';
        message = 'Access denied. Check permissions.';
        break;
      case 500:
        code = 'SERVER_ERROR';
        message = 'Google Drive API server error. Please try again later.';
        break;
      default:
        code = defaultCode;
    }

    throw new DriveApiError(message, code, status);
  }
}

