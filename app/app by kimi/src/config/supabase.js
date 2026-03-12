// Supabase Configuration
import { createClient } from '@supabase/supabase-js';
import CryptoJS from 'crypto-js';

// Your Supabase configuration - ACTUAL VALUES
const supabaseUrl = 'https://wsljtenmounwsjzduxxf.supabase.co';
const supabaseAnonKey = 'sb_publishable_1QwcCrAHeHnF57GIkofj_g_0ILmNwNe';

// Initialize Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database table names
export const TABLES = {
  USERS: 'users',
  DOCUMENTS: 'documents'
};

// Document Upload Key System
export const DocumentKeys = {
  // Generate a unique document key
  generateDocumentKey: (userId, documentType) => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    const keyData = `${userId}_${documentType}_${timestamp}_${random}`;
    
    // Create a secure hash
    const secureKey = CryptoJS.SHA256(keyData).toString();
    
    return {
      uploadKey: secureKey.substring(0, 32), // First 32 chars for upload
      documentId: secureKey.substring(32, 64), // Next 32 chars for document ID
      accessKey: secureKey // Full key for access
    };
  },
  
  // Validate document key format
  validateDocumentKey: (key) => {
    return key && key.length === 64 && /^[a-f0-9]+$/i.test(key);
  },
  
  // Extract user info from key
  extractUserInfo: (key) => {
    if (!DocumentKeys.validateDocumentKey(key)) {
      return null;
    }
    
    return {
      isValid: true,
      uploadKey: key.substring(0, 32),
      documentId: key.substring(32, 64)
    };
  },
  
  // Generate storage path
  generateStoragePath: (userId, uploadKey, filename) => {
    return `${userId}/${uploadKey}/${filename}`;
  },
  
  // Create document metadata
  createDocumentMetadata: (userId, documentType, title) => {
    const keys = DocumentKeys.generateDocumentKey(userId, documentType);
    
    return {
      uploadKey: keys.uploadKey,
      documentId: keys.documentId,
      accessKey: keys.accessKey,
      storagePath: DocumentKeys.generateStoragePath(userId, keys.uploadKey, `doc_${Date.now()}.jpg`),
      createdAt: new Date().toISOString(),
      documentType: documentType,
      title: title || `Document ${new Date().toLocaleDateString()}`
    };
  }
};

export default supabase;
