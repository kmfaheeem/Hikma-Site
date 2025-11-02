# 🎯 Start Here - Union Site Setup

## Welcome!

This guide will help you get the Union Site running in minutes.

## 📋 Prerequisites Checklist

- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] Firebase account created
- [ ] Google account for testing

## ⚡ Quick Setup (5 Steps)

### Step 1: Install
```bash
npm install
```

### Step 2: Firebase Project
1. Visit [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Name it (e.g., "union-site")
4. Continue through setup

### Step 3: Enable Services
In Firebase Console, enable:
- **Authentication** → Sign-in method → Enable Google
- **Firestore Database** → Create database → Test mode
- **Realtime Database** → Create database → Test mode  
- **Storage** → Get started → Test mode

### Step 4: Get Config & Create `.env.local`
1. Firebase Console → Project Settings → Your apps → Web → Copy config
2. MongoDB Atlas → Connect → Copy connection string
3. Create `.env.local` in project root:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_value
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_value
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_value
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_value
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_value
NEXT_PUBLIC_FIREBASE_APP_ID=your_value
NEXT_PUBLIC_FIREBASE_DATABASE_URL=your_value

# MongoDB Configuration (for file storage)
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB_NAME=union-site

# Optional: Social Media Links
NEXT_PUBLIC_FACEBOOK_URL=www.facebook.com
NEXT_PUBLIC_TWITTER_URL=www.x.com
NEXT_PUBLIC_INSTAGRAM_URL=www.instagram.com
NEXT_PUBLIC_LINKEDIN_URL=www.linkedin.com
```

**Important**: See `MONGODB_SETUP.md` for detailed MongoDB setup instructions!

### Step 5: Run!
```bash
npm run dev
```

Open: **http://localhost:3000** 🎉

## 🔐 First-Time Setup

### Set Up Firebase Security Rules
See `FIREBASE_SETUP.md` for complete rules. Quick copy-paste:
- Firestore Rules → Copy from `FIREBASE_SETUP.md`
- Realtime Database Rules → Copy from `FIREBASE_SETUP.md`
- Storage Rules → Copy from `FIREBASE_SETUP.md`

### Assign Your First Admin Role
1. Sign in at http://localhost:3000 with Google
2. Go to Firebase Console → Firestore → `users` collection
3. Find your user document (by email)
4. Click document → Add field: `role` → Value: `"admin"`
5. Refresh the app

## ✅ Verify Everything Works

- [ ] Home page loads with animations
- [ ] "Sign in with Google" button works
- [ ] After sign-in, user appears in Firestore
- [ ] Role assignment works (check Firestore)
- [ ] Navigation shows correct pages for your role
- [ ] Chat page loads (if student/admin)
- [ ] Admin dashboard visible (if admin)

## 🎮 What to Try

### As Admin:
- ✅ Visit Admin Dashboard (`/admin`)
- ✅ Create an Event (`/events`)
- ✅ Upload Gallery Image (`/gallery`)
- ✅ Send Notification (use Firebase Console → Firestore → `notifications`)
- ✅ Access Settings (`/settings`)

### As Student:
- ✅ Create Blog Post (`/blog`)
- ✅ Send Chat Message (`/chat`)
- ✅ View Gallery & Events

## 🆘 Common Issues

**"Firebase: Error (auth/configuration-not-found)"**
→ Check `.env.local` has all variables

**"Permission denied" on Firestore**
→ Copy security rules from `FIREBASE_SETUP.md`

**Role not working**
→ Verify role field in Firestore is exactly `"admin"`, `"student-full"`, or `"student-limited"` (with quotes)

**Port 3000 already in use**
→ Run `npm run dev -- -p 3001`

## 📚 Next Steps

- Read `README.md` for full documentation
- Check `FIREBASE_SETUP.md` for detailed Firebase setup
- Review `QUICK_START.md` for condensed guide

## 🎉 You're Ready!

The Union Site is now running. Start by:
1. Signing in with Google
2. Setting your role to admin
3. Exploring all features

Happy coding! 🚀

