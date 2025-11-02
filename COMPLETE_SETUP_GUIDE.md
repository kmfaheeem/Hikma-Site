# 🚀 Complete Setup Guide - Union Site

This is a comprehensive step-by-step guide to set up the Union Site from scratch.

## 📋 Prerequisites Checklist

Before you begin, ensure you have:

- [ ] Node.js 18 or higher installed ([Download](https://nodejs.org/))
- [ ] npm (comes with Node.js) or yarn package manager
- [ ] A Google account (for Firebase authentication)
- [ ] A MongoDB Atlas account (free tier available)
- [ ] Code editor (VS Code recommended)
- [ ] Git (optional, for version control)

**Verify Node.js installation:**
```bash
node --version  # Should show v18.x.x or higher
npm --version   # Should show 9.x.x or higher
```

---

## 📦 Step 1: Install Dependencies

1. **Open your terminal/command prompt** in the project directory

2. **Install all dependencies:**
```bash
npm install
```

This will install:
- Next.js 16
- React 19
- Firebase SDK
- MongoDB driver
- Framer Motion
- Tailwind CSS
- And all other required packages

**Expected time:** 2-5 minutes

**If you get errors:**
- Try deleting `node_modules` and `package-lock.json`, then run `npm install` again
- Make sure you're using Node.js 18+

---

## 🔥 Step 2: Set Up Firebase

### 2.1 Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. **Enter project name**: `union-site` (or your preferred name)
4. **Disable Google Analytics** (optional, for free tier) or enable if you want
5. Click **"Create project"**
6. Wait for project creation (about 30 seconds)
7. Click **"Continue"**

### 2.2 Enable Google Authentication

1. In Firebase Console, click **"Authentication"** in the left sidebar
2. Click **"Get started"** (if first time)
3. Go to **"Sign-in method"** tab
4. Click on **"Google"** provider
5. Toggle **"Enable"** to ON
6. Enter a **Project support email** (your email)
7. Click **"Save"**

### 2.3 Create Firestore Database

1. Click **"Firestore Database"** in left sidebar
2. Click **"Create database"**
3. Select **"Start in test mode"** (we'll add security rules later)
4. Choose a **location** closest to your users (e.g., `us-central1`)
5. Click **"Enable"**
6. Wait for database creation

### 2.4 Create Realtime Database

1. Click **"Realtime Database"** in left sidebar
2. Click **"Create database"**
3. Choose a **location**
4. Click **"Next"**
5. Select **"Start in test mode"**
6. Click **"Enable"**
7. **Copy the database URL** - you'll need this!

### 2.5 Set Up Firebase Security Rules

#### Firestore Rules:
1. In Firebase Console, go to **Firestore Database** → **Rules** tab
2. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null && 
        (request.auth.uid == userId || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Blog posts
    match /blogPosts/{postId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        (resource.data.authorId == request.auth.uid || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
    
    // Notifications
    match /notifications/{notificationId} {
      allow read: if request.auth != null && 
        resource.data.userId == request.auth.uid;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Events
    match /events/{eventId} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Gallery
    match /gallery/{imageId} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

3. Click **"Publish"**

#### Realtime Database Rules:
1. Go to **Realtime Database** → **Rules** tab
2. Replace with:

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

3. Click **"Publish"**

### 2.6 Get Firebase Configuration

1. Click the **gear icon** (⚙️) next to "Project Overview"
2. Scroll down to **"Your apps"** section
3. Click the **Web icon** (`</>`)
4. Register your app:
   - **App nickname**: `Union Site Web`
   - **Firebase Hosting**: (uncheck, optional)
5. Click **"Register app"**
6. **Copy the configuration object** - you'll need these values:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123..."
};
```

**Keep this tab open** - you'll need these values!

---

## 🍃 Step 3: Set Up MongoDB Atlas

### 3.1 Create MongoDB Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Click **"Try Free"**
3. Sign up with:
   - Google account (easiest), or
   - Email address
4. Fill in your details
5. Complete email verification if required

### 3.2 Create Cluster

1. After login, click **"Build a Database"**
2. Choose **"FREE"** (M0) tier
3. **Cloud Provider**: AWS (or Azure/GCP)
4. **Region**: Choose closest to you (e.g., `us-east-1`)
5. **Cluster Name**: Leave default or change to `Cluster0`
6. Click **"Create"**
7. Wait 3-5 minutes for cluster creation

### 3.3 Create Database User

1. In "Security" section, click **"Database Access"**
2. Click **"Add New Database User"**
3. **Authentication Method**: Password
4. **Username**: Create one (e.g., `union-site-admin`)
5. **Password**: 
   - Click "Autogenerate Secure Password" OR
   - Create your own (save it!)
   - **IMPORTANT**: Copy and save the password!
6. **Database User Privileges**: "Read and write to any database"
7. Click **"Add User"**

**⚠️ Save your username and password - you'll need them!**

### 3.4 Configure Network Access

1. In "Security" section, click **"Network Access"**
2. Click **"Add IP Address"**
3. For development: Click **"Allow Access from Anywhere"** (`0.0.0.0/0`)
   - ⚠️ For production, add only specific IPs!
4. Click **"Confirm"**

### 3.5 Get Connection String

1. Click **"Database"** in left sidebar
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. **Driver**: Node.js
5. **Version**: 6.0 or later
6. **Copy the connection string** - looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

7. **Replace** `<username>` and `<password>` in the string:
   ```
   mongodb+srv://union-site-admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

**⚠️ If your password has special characters, URL-encode them!**
- `@` becomes `%40`
- `#` becomes `%23`
- `$` becomes `%24`
- etc.

---

## 🔐 Step 4: Create Environment Variables File

1. In your project root directory, create a file named `.env.local`

2. **Copy this template** and fill in your values:

```env
# ============================================
# FIREBASE CONFIGURATION (Required)
# ============================================
# Get these from Firebase Console > Project Settings > Your apps > Web
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abc123def456
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your-project-id-default-rtdb.firebaseio.com

# ============================================
# MONGODB CONFIGURATION (Required for file storage)
# ============================================
# Get this from MongoDB Atlas > Connect > Connect your application
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB_NAME=union-site

# ============================================
# SOCIAL MEDIA LINKS (Optional)
# ============================================
NEXT_PUBLIC_FACEBOOK_URL=www.facebook.com
NEXT_PUBLIC_TWITTER_URL=www.x.com
NEXT_PUBLIC_INSTAGRAM_URL=www.instagram.com
NEXT_PUBLIC_LINKEDIN_URL=www.linkedin.com
```

3. **Replace placeholder values** with your actual values:

**Firebase values** (from Step 2.6):
- `NEXT_PUBLIC_FIREBASE_API_KEY` → Your `apiKey`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` → Your `authDomain`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID` → Your `projectId`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` → Your `storageBucket`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` → Your `messagingSenderId`
- `NEXT_PUBLIC_FIREBASE_APP_ID` → Your `appId`
- `NEXT_PUBLIC_FIREBASE_DATABASE_URL` → From Step 2.4

**MongoDB values** (from Step 3.5):
- `MONGODB_URI` → Your complete connection string with username/password
- `MONGODB_DB_NAME` → `union-site` (or your preferred name)

**Social Media** (optional):
- Update with your actual social media URLs

4. **Save the file** as `.env.local` (with the dot at the beginning!)

**⚠️ IMPORTANT:**
- Never commit `.env.local` to Git!
- Keep this file secret - it contains sensitive credentials
- Make sure there are no spaces around the `=` sign

---

## 🚀 Step 5: Start the Development Server

1. **Open terminal** in your project directory

2. **Start the server:**
```bash
npm run dev
```

3. **Wait for compilation** - you should see:
```
▲ Next.js 16.0.1
- Local:        http://localhost:3000
- ready started server on 0.0.0.0:3000
```

4. **Open your browser** and go to:
```
http://localhost:3000
```

5. **You should see** the Union Site homepage with the loading animation!

---

## 👤 Step 6: Set Up Your First Admin Account

### 6.1 Sign In with Google

1. On the homepage, click **"Sign in with Google"**
2. **Select your Google account**
3. **Authorize** the application
4. You should be redirected back and see your name in the navbar

### 6.2 Assign Admin Role

1. **Open Firebase Console** in a new tab
2. Go to **Firestore Database**
3. Click on the **`users`** collection (it should exist now)
4. Find your user document (by your email address)
5. **Click on the document**
6. You'll see fields like:
   - `email`: your email
   - `displayName`: your name
   - `createdAt`: timestamp

7. **Add the role field:**
   - Click **"Add field"**
   - **Field name**: `role`
   - **Field type**: `string`
   - **Field value**: `admin`
   - Click **"Save"**

8. **Refresh your browser** (the Union Site tab)
9. You should now see **Admin** and **Settings** links in the navigation!

---

## ✅ Step 7: Verify Everything Works

### Test Authentication
- [ ] Sign in button works
- [ ] Google login redirects properly
- [ ] User appears in Firestore `users` collection
- [ ] Role assignment works

### Test Pages
- [ ] Home page loads with animations
- [ ] About page accessible
- [ ] Blog page accessible
- [ ] Can create blog post (as student)
- [ ] Gallery page accessible
- [ ] Can upload image to gallery (as admin)
- [ ] Events page accessible
- [ ] Can create event (as admin)
- [ ] Chat page accessible (requires login)
- [ ] Admin dashboard accessible (as admin)
- [ ] Settings page accessible (as admin)

### Test File Upload (MongoDB)
- [ ] Upload image to gallery works
- [ ] Image appears in MongoDB Atlas > Browse Collections > `files.files`
- [ ] Image displays correctly on gallery page

### Test Notifications
- [ ] Notification icon appears in navbar (when logged in)
- [ ] Clicking icon shows notification box
- [ ] Can create notification via Firebase Console

---

## 🎯 Quick Test Checklist

Run through these to ensure everything works:

```bash
# 1. Start server
npm run dev

# 2. Open browser to http://localhost:3000

# 3. Sign in with Google

# 4. Set role to "admin" in Firestore

# 5. Test admin features:
#    - Go to /admin (should see dashboard)
#    - Go to /gallery (upload an image)
#    - Go to /events (create an event)

# 6. Test student features:
#    - Create a blog post at /blog
#    - Send message in /chat
```

---

## 🐛 Troubleshooting Common Issues

### Issue: "MongoNetworkError" or MongoDB connection fails

**Solutions:**
1. Check MongoDB Atlas Network Access allows your IP
2. Verify connection string has correct username/password
3. URL-encode special characters in password
4. Check MongoDB Atlas cluster is running (not paused)

### Issue: "Firebase: Error (auth/configuration-not-found)"

**Solutions:**
1. Verify all Firebase env variables in `.env.local`
2. Check variable names start with `NEXT_PUBLIC_`
3. Restart development server after changing `.env.local`
4. Ensure no spaces around `=` in `.env.local`

### Issue: Port 3000 already in use

**Solution:**
```bash
# Use a different port
npm run dev -- -p 3001
```

### Issue: Role not updating after setting in Firestore

**Solutions:**
1. Refresh the browser page
2. Sign out and sign back in
3. Check role field is exactly `"admin"` (with quotes in Firestore UI)
4. Verify field name is `role` (lowercase)

### Issue: File upload fails

**Solutions:**
1. Check MongoDB connection string is correct
2. Verify MongoDB Atlas cluster is not paused
3. Check network access allows your IP
4. Look at browser console for error messages
5. Check server terminal for error logs

### Issue: Images not displaying

**Solutions:**
1. Verify MongoDB file exists in `files.files` collection
2. Check file URL format: `/api/files/[fileId]`
3. Ensure Next.js Image component has correct configuration
4. Check browser console for 404 errors

---

## 📚 Additional Resources

### Documentation Files

- **`README.md`** - Main project documentation
- **`START_HERE.md`** - Quick start guide
- **`QUICK_START.md`** - Condensed setup
- **`FIREBASE_SETUP.md`** - Detailed Firebase configuration
- **`MONGODB_SETUP.md`** - Detailed MongoDB configuration
- **`COMPLETE_SETUP_GUIDE.md`** - This file (most comprehensive)

### External Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Framer Motion Documentation](https://www.framer.com/motion/)

---

## 🎓 Next Steps After Setup

1. **Customize the site:**
   - Update social media links
   - Add your class information to About page
   - Customize colors/styling if needed

2. **Set up additional accounts:**
   - Create 2 more admin accounts (total 3)
   - Create 30 student-full accounts
   - Create 30 student-limited accounts
   - See `scripts/seed-users.ts` for reference

3. **Add content:**
   - Create blog posts
   - Upload gallery images
   - Create events

4. **Test thoroughly:**
   - Test all user roles
   - Test all features
   - Test on mobile devices

5. **Deploy to production:**
   - Set up production Firebase project
   - Set up production MongoDB cluster
   - Configure production environment variables
   - Deploy to Vercel, Netlify, or your preferred platform

---

## 🆘 Need Help?

If you encounter issues:

1. **Check the documentation files** mentioned above
2. **Check browser console** (F12) for errors
3. **Check server terminal** for error logs
4. **Verify all environment variables** are set correctly
5. **Verify Firebase and MongoDB** are configured correctly

---

## 🎉 Success!

If you've completed all steps and everything works, congratulations! Your Union Site is now ready to use.

**Remember:**
- Keep `.env.local` secure and never commit it to Git
- Regularly backup your MongoDB database
- Monitor Firebase usage to stay within free tier limits
- Test all features thoroughly before going live

Happy coding! 🚀

