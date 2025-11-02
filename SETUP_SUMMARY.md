# ⚡ Setup Summary - Quick Reference

## Fast Track Setup (5 Steps)

### 1️⃣ Install Dependencies
```bash
npm install
```

### 2️⃣ Set Up Firebase
1. Create project at [firebase.google.com](https://console.firebase.google.com/)
2. Enable: Authentication (Google), Firestore, Realtime Database
3. Copy config from Project Settings → Your apps → Web
4. Copy security rules from `FIREBASE_SETUP.md`

### 3️⃣ Set Up MongoDB
1. Create account at [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster
3. Create database user (save password!)
4. Allow network access (0.0.0.0/0 for dev)
5. Get connection string

### 4️⃣ Create `.env.local`
```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_FIREBASE_DATABASE_URL=...

# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster0.xxx.mongodb.net/...
MONGODB_DB_NAME=union-site
```

### 5️⃣ Run & Configure
```bash
npm run dev
```
- Open http://localhost:3000
- Sign in with Google
- Set role to "admin" in Firestore → users collection

## 📚 Full Guides

- **Complete Setup**: [`COMPLETE_SETUP_GUIDE.md`](./COMPLETE_SETUP_GUIDE.md)
- **Quick Start**: [`START_HERE.md`](./START_HERE.md)
- **Firebase Setup**: [`FIREBASE_SETUP.md`](./FIREBASE_SETUP.md)
- **MongoDB Setup**: [`MONGODB_SETUP.md`](./MONGODB_SETUP.md)

## ✅ Verification Checklist

- [ ] Dependencies installed
- [ ] Firebase configured
- [ ] MongoDB configured
- [ ] `.env.local` created
- [ ] Server runs (`npm run dev`)
- [ ] Can sign in with Google
- [ ] Admin role set in Firestore
- [ ] Can access admin pages
- [ ] Can upload images (tests MongoDB)

## 🐛 Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| MongoDB connection fails | Check network access & connection string |
| Firebase auth error | Verify env variables, restart server |
| Port in use | `npm run dev -- -p 3001` |
| Role not working | Refresh page, re-sign in |

**Need more help?** See [`COMPLETE_SETUP_GUIDE.md`](./COMPLETE_SETUP_GUIDE.md)

