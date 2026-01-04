import { Component, inject, signal, computed, effect } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProjectService, IntakeFormData } from '../../../../core/services/project.service';

@Component({
  selector: 'app-intake-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './intake-form.component.html',
  styleUrl: './intake-form.component.scss'
})
export class IntakeFormComponent {
  private fb = inject(FormBuilder);
  private projectService = inject(ProjectService);
  
  // Form group for intake data
  intakeForm: FormGroup;
  
  // Loading and error states
  isSubmitting = signal(false);
  submitError = signal<string | null>(null);
  
  // Computed signal for active project ID
  activeProjectId = computed(() => {
    return this.projectService.activeProjectId();
  });
  
  constructor() {
    this.intakeForm = this.fb.group({
      // Section I: VERIFY ID
      lastName: ['', [Validators.required, Validators.minLength(1)]],
      firstName: [''],
      poiId: ['', [Validators.required]],
      authority: ['', [Validators.required]],
      expiryDate: [''],
      
      // Section III: VERIFY BANKING
      bsb: ['', [Validators.required, Validators.pattern(/^\d{3}-\d{3}$/)]],
      accountNumber: ['', [Validators.required]],
      
      // Optional business fields
      entityName: [''],
      abnNumber: ['']
    });
    
    // Watch for extracted identity and auto-populate form
    effect(() => {
      const extractedIdentity = this.projectService.extractedIdentity();
      if (extractedIdentity) {
        this.populateFromExtraction(extractedIdentity);
        // Clear the extracted identity after populating to avoid re-triggering
        setTimeout(() => {
          this.projectService.setExtractedIdentity(null);
        }, 100);
      }
    });
  }
  
  /**
   * Validate form and submit to generate project ID
   */
  async onSubmit(): Promise<void> {
    if (this.intakeForm.invalid) {
      // Mark all fields as touched to show validation errors
      Object.keys(this.intakeForm.controls).forEach(key => {
        this.intakeForm.get(key)?.markAsTouched();
      });
      return;
    }
    
    this.isSubmitting.set(true);
    this.submitError.set(null);
    
    try {
      const formValue = this.intakeForm.value;
      
      // Prepare form data for project ID generation
      const formData: IntakeFormData = {
        lastName: formValue.lastName.trim(),
        firstName: formValue.firstName?.trim() || '',
        poiId: formValue.poiId?.trim() || '',
        bsb: formValue.bsb?.trim() || '',
        account: formValue.accountNumber?.trim() || ''
      };
      
      // Generate project ID via ProjectService
      await this.projectService.generateProjectId(formData);
      
      console.log('[INTAKE FORM] Project ID generated successfully:', this.activeProjectId());
      
      // Form submission successful - project ID is now stored in ProjectService
      // Optionally reset form or keep data for reference
      
    } catch (error: unknown) {
      console.error('[INTAKE FORM] Error generating project ID:', error);
      
      // Safe type-narrowing for error messages
      const err = error as { error?: { error?: string }; message?: string };
      this.submitError.set(
        err?.error?.error || err?.message || 'Failed to generate project ID. Please try again.'
      );
    } finally {
      this.isSubmitting.set(false);
    }
  }
  
  /**
   * Get form control for template access
   */
  getControl(name: string) {
    return this.intakeForm.get(name);
  }
  
  /**
   * Check if a field has validation errors
   */
  hasError(controlName: string): boolean {
    const control = this.getControl(controlName);
    return !!(control && control.invalid && control.touched);
  }
  
  /**
   * Get error message for a field
   */
  getErrorMessage(controlName: string): string {
    const control = this.getControl(controlName);
    if (!control || !control.errors) return '';
    
    if (control.errors['required']) {
      return 'This field is required';
    }
    if (control.errors['pattern']) {
      if (controlName === 'bsb') {
        return 'BSB must be in format XXX-XXX';
      }
      return 'Invalid format';
    }
    if (control.errors['minlength']) {
      return `Minimum length is ${control.errors['minlength'].requiredLength}`;
    }
    
    return 'Invalid value';
  }
  
  /**
   * Populate form from extracted identity data
   * Called automatically when identity is extracted from document
   * @param data Extracted identity data with firstName, lastName, and idNumber
   */
  populateFromExtraction(data: { firstName: string; lastName: string; idNumber: string }): void {
    // Update form controls without triggering validation errors
    // Use patchValue to update only specified fields
    this.intakeForm.patchValue({
      lastName: data.lastName || '',
      firstName: data.firstName || '',
      poiId: data.idNumber || ''
    }, { emitEvent: false });
    
    // Mark fields as touched so they show as filled (but don't trigger validation errors)
    if (data.lastName) {
      this.intakeForm.get('lastName')?.markAsTouched();
    }
    if (data.firstName) {
      this.intakeForm.get('firstName')?.markAsTouched();
    }
    if (data.idNumber) {
      this.intakeForm.get('poiId')?.markAsTouched();
    }
    
    console.log('[INTAKE FORM] Form populated from extraction:', {
      lastName: data.lastName,
      firstName: data.firstName,
      poiId: data.idNumber
    });
  }
}
