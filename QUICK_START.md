# 🚀 Quick Start Guide - Union Site

## Get Started in 5 Minutes

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Firebase
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable:
   - Authentication (Google provider)
   - Firestore Database
   - Realtime Database
   - Storage

### 3. Create `.env.local` File
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your_project-default-rtdb.firebaseio.com
```

### 4. Configure Firebase Security Rules
Copy rules from `FIREBASE_SETUP.md` to your Firebase Console:
- Firestore Rules
- Realtime Database Rules
- Storage Rules

### 5. Run the App
```bash
npm run dev
```

Visit: **http://localhost:3000**

### 6. Test Authentication
1. Click "Sign in with Google"
2. Sign in with your Google account
3. Check Firebase Console > Firestore > `users` collection
4. Set your user's `role` field to `"admin"`, `"student-full"`, or `"student-limited"`

## Account Setup

**Total Accounts**: 63
- 3 Admin accounts
- 30 Full-access student accounts  
- 30 Limited-access student accounts

Set roles in Firebase Console:
1. Go to Firestore > `users` collection
2. Find user document by email
3. Update `role` field with one of:
   - `"admin"`
   - `"student-full"`
   - `"student-limited"`

## What's Next?

- ✅ Explore all pages
- ✅ Test chat functionality
- ✅ Create blog posts (students)
- ✅ Upload gallery images (admin)
- ✅ Create events (admin)
- ✅ Check notifications

## Need Help?

See `README.md` for detailed documentation or `FIREBASE_SETUP.md` for Firebase configuration.

