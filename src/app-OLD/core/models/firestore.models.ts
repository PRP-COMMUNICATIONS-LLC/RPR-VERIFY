/**
 * Firestore data models and interfaces
 */

export interface Case {
  id?: string; // Document ID (optional for creation, required after)
  subject: string;
  description?: string;
  status: 'Pending' | 'In Review' | 'Resolved' | 'Closed';
  risk: 'High' | 'Medium' | 'Low';
  date: string; // ISO date string
  assignedTo: string;
  type?: string;
  priority?: 'Low' | 'Medium' | 'High';
  tags?: string[];
  createdAt?: Date | any; // Firestore Timestamp
  updatedAt?: Date | any; // Firestore Timestamp
  createdBy?: string;
  updatedBy?: string;
}

export interface Dispute {
  id?: string; // Document ID
  caseId: string; // Reference to parent case
  summary: string;
  description?: string;
  status: 'Open' | 'Closed' | 'Pending';
  createdAt?: Date | any; // Firestore Timestamp
  updatedAt?: Date | any; // Firestore Timestamp
  createdBy?: string;
  resolvedBy?: string;
  resolution?: string;
}

export interface Note {
  id?: string; // Document ID
  caseId: string; // Reference to parent case
  content: string;
  author: string;
  createdAt?: Date | any; // Firestore Timestamp
  updatedAt?: Date | any; // Firestore Timestamp
  isInternal?: boolean; // Whether note is internal-only
}

export interface DocumentMetadata {
  id?: string; // Document ID
  caseId: string; // Reference to parent case
  fileName: string;
  fileType: string;
  fileSize?: number; // Size in bytes
  mimeType?: string;
  uploadedBy: string;
  uploadDate: Date | any; // Firestore Timestamp
  googleDriveFileId?: string; // If stored in Google Drive
  storageUrl?: string; // Firebase Storage URL if stored there
  description?: string;
  tags?: string[];
}
