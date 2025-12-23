import { Injectable, inject } from '@angular/core';
import { Firestore, collection, doc, addDoc, getDoc, getDocs, updateDoc, query, where, orderBy, Timestamp } from '@angular/fire/firestore';
import { Case, Dispute, Note, DocumentMetadata } from '../models/firestore.models';

@Injectable({
  providedIn: 'root'
})
export class FirestoreCasesService {
  private firestore = inject(Firestore);

  // Collection references
  private readonly casesCollection = 'cases';
  private readonly disputesCollection = 'disputes';
  private readonly notesCollection = 'notes';

  /**
   * Create a new case in Firestore
   */
  async createCase(caseData: Omit<Case, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const now = Timestamp.now();
      const caseWithTimestamps: Omit<Case, 'id'> = {
        ...caseData,
        createdAt: now,
        updatedAt: now
      };

      const docRef = await addDoc(
        collection(this.firestore, this.casesCollection),
        caseWithTimestamps
      );

      return docRef.id;
    } catch (error) {
      console.error('Error creating case:', error);
      throw new Error('Failed to create case: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  }

  /**
   * Get a case by its ID
   */
  async getCaseById(caseId: string): Promise<Case | null> {
    try {
      const docRef = doc(this.firestore, this.casesCollection, caseId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        } as Case;
      }

      return null;
    } catch (error) {
      console.error('Error getting case:', error);
      throw new Error('Failed to get case: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  }

  /**
   * List all cases, optionally filtered by status
   */
  async listCases(statusFilter?: Case['status']): Promise<Case[]> {
    try {
      let q = query(
        collection(this.firestore, this.casesCollection),
        orderBy('date', 'desc')
      );

      if (statusFilter) {
        q = query(
          collection(this.firestore, this.casesCollection),
          where('status', '==', statusFilter),
          orderBy('date', 'desc')
        );
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Case));
    } catch (error) {
      console.error('Error listing cases:', error);
      throw new Error('Failed to list cases: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  }

  /**
   * Update the status of a case
   */
  async updateCaseStatus(caseId: string, newStatus: Case['status'], updatedBy?: string): Promise<void> {
    try {
      const docRef = doc(this.firestore, this.casesCollection, caseId);
      const updateData: Partial<Case> = {
        status: newStatus,
        updatedAt: Timestamp.now()
      };

      if (updatedBy) {
        updateData.updatedBy = updatedBy;
      }

      await updateDoc(docRef, updateData);
    } catch (error) {
      console.error('Error updating case status:', error);
      throw new Error('Failed to update case status: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  }

  /**
   * Attach document metadata to a case
   */
  async attachDocumentMetadata(caseId: string, metadata: Omit<DocumentMetadata, 'id' | 'caseId' | 'uploadDate'>): Promise<string> {
    try {
      const now = Timestamp.now();
      const documentData: Omit<DocumentMetadata, 'id'> = {
        ...metadata,
        caseId,
        uploadDate: now
      };

      const docRef = await addDoc(
        collection(this.firestore, 'documents'), // Using 'documents' collection for document metadata
        documentData
      );

      return docRef.id;
    } catch (error) {
      console.error('Error attaching document metadata:', error);
      throw new Error('Failed to attach document metadata: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  }

  /**
   * Get all disputes for a case
   */
  async getDisputesByCaseId(caseId: string): Promise<Dispute[]> {
    try {
      const q = query(
        collection(this.firestore, this.disputesCollection),
        where('caseId', '==', caseId),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Dispute));
    } catch (error) {
      console.error('Error getting disputes:', error);
      throw new Error('Failed to get disputes: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  }

  /**
   * Get all notes for a case
   */
  async getNotesByCaseId(caseId: string): Promise<Note[]> {
    try {
      const q = query(
        collection(this.firestore, this.notesCollection),
        where('caseId', '==', caseId),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Note));
    } catch (error) {
      console.error('Error getting notes:', error);
      throw new Error('Failed to get notes: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  }
}
