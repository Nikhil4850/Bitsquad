# Firebase Setup Guide

## Overview
This application now uses Firebase for authentication, database, and storage instead of Supabase.

## Firebase Services Used

1. **Firebase Authentication** - User sign up, sign in, and email verification
2. **Cloud Firestore** - NoSQL database for storing user profiles, documents, and chat messages
3. **Firebase Storage** - File storage for uploaded documents
4. **Firebase Analytics** - Usage analytics

## Firestore Database Structure

### Collections

#### `users`
```
{
  id: string (document ID = user UID)
  name: string
  email: string
  plan: 'free' | 'premium' | 'enterprise'
  documentsAnalyzed: number
  joinDate: timestamp
  createdAt: timestamp
  updatedAt: timestamp
}
```

#### `documents`
```
{
  id: string (auto-generated)
  userId: string (reference to user)
  name: string
  type: string
  size: number
  uploadDate: timestamp
  content: string
  status: 'uploaded' | 'processing' | 'analyzed' | 'error'
  analysisData: object (optional)
  createdAt: timestamp
  updatedAt: timestamp
}
```

#### `chat_messages`
```
{
  id: string (auto-generated)
  userId: string (reference to user)
  documentId: string (optional, reference to document)
  role: 'user' | 'assistant'
  content: string
  timestamp: timestamp
  createdAt: timestamp
}
```

## Firestore Security Rules

To set up proper security rules in Firebase Console, go to Firestore Database > Rules and add:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow create: if request.auth != null && request.auth.uid == userId;
      allow update: if request.auth != null && request.auth.uid == userId;
      allow delete: if false; // Prevent deletion
    }
    
    // Documents collection
    match /documents/{documentId} {
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow update: if request.auth != null && resource.data.userId == request.auth.uid;
      allow delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }
    
    // Chat messages collection
    match /chat_messages/{messageId} {
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow update: if false; // Messages are immutable
      allow delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }
  }
}
```

## Firebase Storage Rules

Go to Storage > Rules and add:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /documents/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Environment Variables (Optional)

For better security, you can move Firebase config to environment variables:

1. Create `.env` file in root:
```
REACT_APP_FIREBASE_API_KEY=AIzaSyB-uPWsDnAnk9SbUADuGpJr-FI4VI0A1ro
REACT_APP_FIREBASE_AUTH_DOMAIN=codebits40.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=codebits40
REACT_APP_FIREBASE_STORAGE_BUCKET=codebits40.firebasestorage.app
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=431962650434
REACT_APP_FIREBASE_APP_ID=1:431962650434:web:c17cfbb06c6947209f7adb
REACT_APP_FIREBASE_MEASUREMENT_ID=G-9HMCTM0B5T
```

2. Update `src/lib/firebase.ts` to use environment variables:
```typescript
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};
```

## Features Implemented

✅ User authentication (sign up, sign in, sign out)
✅ Email verification
✅ User profile management
✅ Document upload and storage
✅ Chat message history
✅ User statistics tracking
✅ Settings with dark mode (stored in localStorage)
✅ Document scanner with camera access

## Testing the App

1. **Sign Up**: Create a new account with email and password
2. **Email Verification**: Check your email for verification link
3. **Sign In**: Log in with verified account
4. **Upload Document**: Use the scanner or upload feature
5. **Chat**: Ask questions about your documents
6. **Settings**: Update profile, change password, toggle dark mode

## Firebase Console Links

- **Authentication**: https://console.firebase.google.com/project/codebits40/authentication
- **Firestore**: https://console.firebase.google.com/project/codebits40/firestore
- **Storage**: https://console.firebase.google.com/project/codebits40/storage
- **Analytics**: https://console.firebase.google.com/project/codebits40/analytics

## Migration from Supabase

The following changes were made:
- ✅ Removed `@supabase/supabase-js` package
- ✅ Deleted `src/lib/supabase.ts`
- ✅ Deleted `src/services/database.ts`
- ✅ Created `src/lib/firebase.ts` with Firebase config
- ✅ Created `src/services/firebaseService.ts` with all Firebase operations
- ✅ Updated `src/App.tsx` to use Firebase services
- ✅ Added Settings component with working features

## Next Steps

1. Set up Firestore security rules in Firebase Console
2. Set up Storage security rules in Firebase Console
3. Enable email/password authentication in Firebase Console
4. (Optional) Set up email templates for verification emails
5. (Optional) Add Firebase Cloud Functions for document analysis
6. (Optional) Implement Firebase Storage for actual document uploads
