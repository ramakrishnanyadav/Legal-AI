// src/lib/storage.ts - Complete Storage System

import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc,
  doc,
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp,
  updateDoc
} from 'firebase/firestore';
import { db } from './firebase';
import { AnalyzeCaseResponse } from './api';

// ============================================
// INTERFACES
// ============================================

export interface UploadedEvidence {
  id: string;
  fileName: string;
  fileType: string;
  cloudinaryUrl: string;
  publicId: string;
  uploadedAt: string;
  size: number;
}

export interface FIRData {
  complainantName: string;
  complainantAddress: string;
  complainantPhone: string;
  complainantEmail?: string;
  incidentDate: string;
  incidentTime: string;
  incidentPlace: string;
  accusedDetails: string;
  witnessDetails: string;
  description: string;
  primarySection: { code: string; name: string };
  relatedSections: Array<{ code: string; name: string }>;
  generatedDate: string;
  lastModified?: string;
}

export interface EvidenceChecklistItem {
  id: string;
  label: string;
  category: 'document' | 'digital' | 'physical' | 'witness';
  description: string;
  isChecked: boolean;
}

export interface EvidenceChecklistData {
  items: EvidenceChecklistItem[];
  checkedItemIds: string[];
  completionPercentage: number;
  lastUpdated: string;
}

export interface CaseRecord {
  id?: string;
  userId: string;
  userName: string;
  caseType: string;
  isUrgent: boolean;
  description: string;
  analysisResults: AnalyzeCaseResponse;
  firData: FIRData;
  evidenceFiles: UploadedEvidence[];
  evidenceChecklist: EvidenceChecklistData;
  status: 'draft' | 'submitted' | 'under_review' | 'closed';
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

const CASES_COLLECTION = 'cases';

// ============================================
// CRUD OPERATIONS
// ============================================

/**
 * Save a complete case record
 */
export const saveCaseRecord = async (
  caseData: Omit<CaseRecord, 'id' | 'createdAt'>
): Promise<string | null> => {
  try {
    const docRef = await addDoc(collection(db, CASES_COLLECTION), {
      ...caseData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    
    console.log('✅ Case saved:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('❌ Error saving case:', error);
    return null;
  }
};

/**
 * Update FIR data
 */
export const updateFIRData = async (
  caseId: string,
  firData: FIRData
): Promise<boolean> => {
  try {
    const docRef = doc(db, CASES_COLLECTION, caseId);
    await updateDoc(docRef, {
      firData: {
        ...firData,
        lastModified: new Date().toISOString(),
      },
      updatedAt: Timestamp.now(),
    });
    
    console.log('✅ FIR data updated:', caseId);
    return true;
  } catch (error) {
    console.error('❌ Error updating FIR:', error);
    return false;
  }
};

/**
 * Add evidence files
 */
export const addEvidenceToCase = async (
  caseId: string,
  evidenceFiles: UploadedEvidence[]
): Promise<boolean> => {
  try {
    const docRef = doc(db, CASES_COLLECTION, caseId);
    const caseDoc = await getDoc(docRef);
    
    if (!caseDoc.exists()) {
      throw new Error('Case not found');
    }
    
    const currentEvidence = caseDoc.data().evidenceFiles || [];
    
    await updateDoc(docRef, {
      evidenceFiles: [...currentEvidence, ...evidenceFiles],
      updatedAt: Timestamp.now(),
    });
    
    console.log('✅ Evidence added:', caseId);
    return true;
  } catch (error) {
    console.error('❌ Error adding evidence:', error);
    return false;
  }
};

/**
 * Update evidence checklist
 */
export const updateEvidenceChecklist = async (
  caseId: string,
  checklistData: EvidenceChecklistData
): Promise<boolean> => {
  try {
    const docRef = doc(db, CASES_COLLECTION, caseId);
    await updateDoc(docRef, {
      evidenceChecklist: {
        ...checklistData,
        lastUpdated: new Date().toISOString(),
      },
      updatedAt: Timestamp.now(),
    });
    
    console.log('✅ Checklist updated:', caseId);
    return true;
  } catch (error) {
    console.error('❌ Error updating checklist:', error);
    return false;
  }
};

/**
 * Get all cases for a user
 */
export const getUserCases = async (userId: string): Promise<CaseRecord[]> => {
  try {
    const q = query(
      collection(db, CASES_COLLECTION),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(50)
    );
    
    const querySnapshot = await getDocs(q);
    const cases: CaseRecord[] = [];
    
    querySnapshot.forEach((doc) => {
      cases.push({
        id: doc.id,
        ...doc.data()
      } as CaseRecord);
    });
    
    return cases;
  } catch (error) {
    console.error('❌ Error fetching cases:', error);
    return [];
  }
};

/**
 * Get a single case by ID
 */
export const getCaseById = async (caseId: string): Promise<CaseRecord | null> => {
  try {
    const docRef = doc(db, CASES_COLLECTION, caseId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as CaseRecord;
    }
    return null;
  } catch (error) {
    console.error('❌ Error fetching case:', error);
    return null;
  }
};

/**
 * Delete a case
 */
export const deleteCase = async (caseId: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, CASES_COLLECTION, caseId));
    console.log('✅ Case deleted:', caseId);
    return true;
  } catch (error) {
    console.error('❌ Error deleting case:', error);
    return false;
  }
};

/**
 * Update case status
 */
export const updateCaseStatus = async (
  caseId: string,
  status: CaseRecord['status']
): Promise<boolean> => {
  try {
    const docRef = doc(db, CASES_COLLECTION, caseId);
    await updateDoc(docRef, {
      status,
      updatedAt: Timestamp.now(),
    });
    
    console.log('✅ Status updated:', caseId, status);
    return true;
  } catch (error) {
    console.error('❌ Error updating status:', error);
    return false;
  }
};