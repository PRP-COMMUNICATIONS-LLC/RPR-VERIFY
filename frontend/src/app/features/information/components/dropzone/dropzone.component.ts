import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectService } from '../../../../core/services/project.service';
import { VerificationService } from '../../../../core/services/verification.service';

@Component({
  selector: 'app-dropzone',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dropzone.component.html',
  styleUrl: './dropzone.component.scss'
})
export class DropzoneComponent {
  projectService = inject(ProjectService);
  verificationService = inject(VerificationService);
  
  // Drag state
  isDragging = signal(false);
  
  // Processing state
  isProcessing = signal(false);
  isExtractingIdentity = signal(false);
  processingError = signal<string | null>(null);
  
  // Computed project ID
  activeProjectId = computed(() => {
    return this.projectService.activeProjectId();
  });
  
  /**
   * Handle file selection trigger (for keyboard accessibility)
   * This allows the Enter/Space handlers in the HTML to trigger the file input
   */
  onFileSelect(): void {
    const fileInput = document.querySelector<HTMLInputElement>('input[type="file"]');
    fileInput?.click();
  }
  
  /**
   * Handle drag over event - prevent default and add visual feedback
   */
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(true);
  }
  
  /**
   * Handle drag leave event - remove visual feedback
   */
  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
  }
  
  /**
   * Handle drop event - process dropped files
   */
  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
    
    const files = event.dataTransfer?.files;
    if (!files || files.length === 0) {
      return;
    }
    
    // Process the first file (with identity extraction)
    const file = files[0];
    this.processFile(file);
  }
  
  /**
   * Handle file input change event - process selected files
   */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    
    if (!files || files.length === 0) {
      return;
    }
    
    // Process the first file (with identity extraction)
    const file = files[0];
    this.processFile(file);
    
    // Reset input to allow selecting the same file again
    input.value = '';
  }
  
  /**
   * Process file with zero-touch identity extraction
   * Flow: Extract identity → Generate project ID → Populate form → Process document
   */
  private processFile(file: File): void {
    this.processingError.set(null);
    const existingProjectId = this.activeProjectId();
    
    // Step 1: Extract identity from document (if no project ID exists)
    if (!existingProjectId) {
      this.isExtractingIdentity.set(true);
      console.log('[DROPZONE] Extracting identity from document:', file.name);
      
      this.verificationService.extractIdentity(file).subscribe({
        next: (identity) => {
          console.log('[DROPZONE] Identity extracted:', identity);
          this.isExtractingIdentity.set(false);
          
          // Store extracted identity for intake form auto-population
          this.projectService.setExtractedIdentity(identity);
          
          // Step 2: Generate project ID using extracted data (name already parsed by backend)
          this.generateProjectIdFromExtraction({
            firstName: identity.firstName,
            lastName: identity.lastName,
            poiId: identity.idNumber
          }).then(() => {
            // Step 4: Process document with the new project ID
            const newProjectId = this.activeProjectId();
            if (newProjectId) {
              this.processDocumentWithProjectId(file, newProjectId);
            } else {
              this.processingError.set('Failed to generate project ID. Please try manual entry.');
              this.isProcessing.set(false);
            }
          }).catch((error) => {
            console.error('[DROPZONE] Error generating project ID:', error);
            this.processingError.set(
              'Identity extracted but failed to generate project ID. Please try manual entry.'
            );
            this.isProcessing.set(false);
          });
        },
        error: (error) => {
          console.error('[DROPZONE] Error extracting identity:', error);
          this.isExtractingIdentity.set(false);
          this.processingError.set(
            'Failed to extract identity from document. You can still enter details manually.'
          );
          // Allow manual entry fallback - don't block the user
        }
      });
    } else {
      // Project ID already exists, process document directly
      this.processDocumentWithProjectId(file, existingProjectId);
    }
  }
  
  /**
   * Generate project ID from extracted identity data
   */
  private async generateProjectIdFromExtraction(data: {
    firstName?: string;
    lastName: string;
    poiId?: string;
  }): Promise<void> {
    try {
      await this.projectService.generateProjectId({
        lastName: data.lastName,
        firstName: data.firstName,
        poiId: data.poiId,
        bsb: '',
        account: ''
      });
      console.log('[DROPZONE] Project ID generated:', this.activeProjectId());
    } catch (error) {
      console.error('[DROPZONE] Error generating project ID:', error);
      throw error;
    }
  }
  
  /**
   * Process document with existing project ID
   */
  private processDocumentWithProjectId(file: File, projectId: string): void {
    this.isProcessing.set(true);
    console.log(`[DROPZONE] Processing document for ${projectId}:`, file.name);
    
    this.verificationService.processDocument(file, projectId).subscribe({
      next: (response) => {
        console.log('[DROPZONE] Document processed successfully:', response);
        this.isProcessing.set(false);
      },
      error: (error) => {
        console.error('[DROPZONE] Error processing document:', error);
        this.processingError.set(
          error?.error?.error || error?.message || 'Failed to process document. Please try again.'
        );
        this.isProcessing.set(false);
      }
    });
  }
}
