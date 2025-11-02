# Firebase Setup Guide

This guide will help you set up Firebase for the Union Site project.

## 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard

## 2. Enable Authentication

1. Navigate to **Authentication** > **Sign-in method**
2. Enable **Google** provider
3. Add your domain to authorized domains if needed

## 3. Create Firestore Database

1. Navigate to **Firestore Database**
2. Click "Create database"
3. Start in **test mode** (we'll set up rules later)
4. Choose a location close to your users

### Firestore Security Rules

Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - users can read their own data, admins can read all
    match /users/{userId} {
      allow read: if request.auth != null && 
        (request.auth.uid == userId || get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Blog posts - everyone can read, students and admins can write
    match /blogPosts/{postId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        (resource.data.authorId == request.auth.uid || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
    
    // Notifications - users can only read their own
    match /notifications/{notificationId} {
      allow read: if request.auth != null && 
        resource.data.userId == request.auth.uid;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Events - everyone can read, only admins can write
    match /events/{eventId} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Gallery - everyone can read, only admins can write
    match /gallery/{imageId} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

## 4. Create Realtime Database

1. Navigate to **Realtime Database**
2. Click "Create database"
3. Start in **test mode**
4. Choose a location
5. Copy the database URL

### Realtime Database Rules

Set the rules in **Realtime Database** > **Rules**:

```json
{
  "rules": {
    "chats": {
      ".read": "auth != null",
      ".write": "auth != null",
      "$chatId": {
        "messages": {
          ".read": "auth != null",
          ".write": "auth != null"
        }
      }
    }
  }
}
```

## 5. Set Up Storage

1. Navigate to **Storage**
2. Click "Get started"
3. Start in **test mode**

### Storage Security Rules

Set the rules in **Storage** > **Rules**:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Blog images - authenticated users can upload
    match /blog/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Gallery images - everyone can read, only admins can write
    match /gallery/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && 
        firestore.get(/databases/(default)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Event images - everyone can read, only admins can write
    match /events/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && 
        firestore.get(/databases/(default)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

## 6. Get Configuration Values

1. Navigate to **Project Settings** (gear icon)
2. Scroll down to "Your apps"
3. Click the web icon (`</>`) to add a web app
4. Register your app
5. Copy the Firebase configuration object

## 7. Configure Environment Variables

Create a `.env.local` file in your project root:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your_project_id-default-rtdb.firebaseio.com
```

## 8. Set Up User Roles

After users sign in, manually assign roles in Firestore:

1. Go to **Firestore Database** > **users** collection
2. For each user document, add/update the `role` field:
   - `"admin"` - for 3 admin accounts
   - `"student-full"` - for 30 full-access students
   - `"student-limited"` - for 30 limited-access students

The `role` field should be a string with one of these values.

## 9. Test the Setup

1. Start your development server: `npm run dev`
2. Navigate to your site
3. Try signing in with Google
4. Check Firestore to see if a user document was created
5. Manually assign a role to test different access levels

## Notes

- Users are automatically created in Firestore when they first sign in
- Default role for new users is `"student-limited"`
- You can change roles through Firebase Console or implement a user management interface
- Make sure to update security rules before deploying to production

