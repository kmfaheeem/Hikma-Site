# Union Site

A comprehensive Next.js website with Firebase backend for a class union community site. Features modern animations, real-time chat, notifications, and role-based access control.

## 🚀 Quick Start Guide

> **📖 For detailed step-by-step instructions, see [`COMPLETE_SETUP_GUIDE.md`](./COMPLETE_SETUP_GUIDE.md)**

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Firebase account (free tier is sufficient)
- MongoDB Atlas account (free tier available)
- Google account for authentication

### Step 1: Clone and Install

```bash
# Navigate to project directory
cd union-site

# Install dependencies
npm install
```

### Step 2: Firebase Setup

1. **Create Firebase Project**:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Add project" and follow the setup wizard
   - Note your project ID

2. **Enable Services**:
   - **Authentication**: Go to Authentication > Sign-in method > Enable Google
   - **Firestore Database**: Create database (start in test mode)
   - **Realtime Database**: Create database (start in test mode)
   - **Storage**: Get started (start in test mode)

3. **Get Configuration**:
   - Go to Project Settings > Your apps > Web app
   - Copy the Firebase configuration object

### Step 3: Environment Variables

Create a `.env.local` file in the root directory:

```env
# Firebase Configuration (Required)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your_project_id-default-rtdb.firebaseio.com

# Social Media Links (Optional)
NEXT_PUBLIC_FACEBOOK_URL=www.facebook.com
NEXT_PUBLIC_TWITTER_URL=www.x.com
NEXT_PUBLIC_INSTAGRAM_URL=www.instagram.com
NEXT_PUBLIC_LINKEDIN_URL=www.linkedin.com

# MongoDB Configuration (Required for file storage)
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB_NAME=union-site
```

**Note**: For MongoDB setup, see `MONGODB_SETUP.md` for detailed instructions.

### Step 4: Configure Firebase Security Rules

See `FIREBASE_SETUP.md` for complete security rules. Key rules:
- Firestore: Users can read own data, admins can read all
- Realtime Database: Authenticated users can read/write chat
- Storage: Public read, authenticated write for blog, admin-only for gallery/events

### Step 5: Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Step 6: Assign User Roles

After users sign in with Google, assign roles in Firebase Console:

1. Go to **Firestore Database** > `users` collection
2. For each user document, update the `role` field:
   - `"admin"` - 3 accounts with full access
   - `"student-full"` - 30 accounts with all features
   - `"student-limited"` - 30 accounts with chat and blog access only

**Total Accounts**: 63 (3 admin + 30 full + 30 limited)

## 📋 Features

### Authentication & Access
- ✅ Google OAuth authentication (email-based)
- ✅ Role-based access control (admin, student-full, student-limited)
- ✅ Protected routes with role verification
- ✅ Secure user management

### Pages
- 🏠 **Home**: Animated landing page with feature showcase
- 👥 **About**: Class and student information
- 📝 **Blog**: Read posts, write posts (students can create)
- 🖼️ **Gallery**: View images (admin can upload)
- 📅 **Events**: View events (admin can create)
- 💬 **Chat**: Real-time messaging for authenticated students
- ⚙️ **Admin**: Dashboard with site statistics (admin only)
- 🔧 **Settings**: Site configuration (admin only)

### Features
- ✨ **Modern Animations**: Smooth transitions, hover effects, scroll animations
- 🔔 **Notifications**: Real-time notifications with type badges
- 📱 **Responsive Design**: Works on all devices
- 🌙 **Dark Mode**: Automatic dark mode support
- 🔗 **Social Media**: Configurable social media links
- ⏳ **Loading States**: Beautiful loading animations with Union logo

## 🏗️ Project Structure

```
union-site/
├── app/                    # Next.js app router pages
│   ├── about/             # About page
│   ├── admin/             # Admin dashboard
│   ├── blog/              # Blog listing and posts
│   ├── chat/               # Real-time chat
│   ├── events/             # Events page
│   ├── gallery/            # Gallery page
│   ├── games/              # Games page
│   ├── settings/           # Settings page
│   └── page.tsx            # Home page
├── components/             # React components
│   ├── Footer.tsx
│   ├── LoadingAnimation.tsx
│   ├── MessageBox.tsx
│   ├── Navbar.tsx
│   ├── NotificationIcon.tsx
│   └── ...
├── contexts/               # React contexts
│   └── AuthContext.tsx     # Authentication context
├── lib/                    # Utility functions
│   ├── animations.ts       # Framer Motion variants
│   ├── auth.ts            # Authentication helpers
│   ├── firebase.ts         # Firebase configuration
│   └── notifications.ts   # Notification helpers
└── scripts/                # Utility scripts
    └── seed-users.ts       # User seeding reference
```

## 🔐 Access Control

### Public Pages (No login required)
- Home
- About
- Blog (read only)
- Gallery (view only)
- Events (view only)
- Games

### Student Limited Access
- All public pages
- Chat (email login required)
- Blog (write)

### Student Full Access
- All student limited features
- Gallery (view)
- Events (view)

### Admin Access
- All student full features
- Gallery (upload)
- Events (create/edit)
- Admin Dashboard
- Settings

## 🗄️ Firebase Collections

### Firestore
- `users/` - User profiles with roles
- `blogPosts/` - Blog posts
- `notifications/` - User notifications
- `events/` - Event listings
- `gallery/` - Gallery images metadata

### Realtime Database
- `chats/{chatId}/messages/` - Real-time chat messages

### File Storage (MongoDB GridFS)
- Files stored in MongoDB GridFS with folder structure:
  - `blog/` - Blog post images
  - `gallery/` - Gallery images
  - `events/` - Event images
- Files accessed via `/api/files/[id]` endpoint

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **Backend**: 
  - **Firebase**: Authentication (Google OAuth), Firestore (Database), Realtime Database (Chat)
  - **MongoDB**: GridFS (File Storage - Images)
- **Notifications**: React Hot Toast
- **Fonts**: Geist Sans & Mono

## 📝 Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## 🧪 Testing Checklist

- [ ] Google authentication works
- [ ] Role assignment in Firestore
- [ ] Protected routes redirect correctly
- [ ] Chat sends/receives messages
- [ ] Blog posts can be created (students)
- [ ] Gallery images upload (admin)
- [ ] Events can be created (admin)
- [ ] Notifications appear in real-time
- [ ] All animations work smoothly
- [ ] Responsive design on mobile/tablet/desktop
- [ ] Dark mode works correctly

## 📚 Additional Documentation

- **Firebase Setup**: See `FIREBASE_SETUP.md` for detailed Firebase configuration
- **User Seeding**: See `scripts/seed-users.ts` for user role assignment reference

## 🎨 Design Features

- Modern gradient backgrounds
- Smooth page transitions
- Hover animations on interactive elements
- Scroll-triggered animations
- Loading logo with animated gradient
- Custom scrollbar styling
- Accessible focus states

## 🔧 Troubleshooting

### Port Already in Use
```bash
# Use a different port
npm run dev -- -p 3001
```

### Firebase Configuration Issues
- Verify all environment variables are set correctly
- Check Firebase Console for correct project settings
- Ensure Google authentication is enabled

### Authentication Not Working
- Check Firebase Authentication is enabled
- Verify domain is added to authorized domains
- Check browser console for errors

### Role Not Updating
- Ensure role is set in Firestore `users` collection
- Check the field name is exactly `role` (lowercase)
- Verify role value matches: `"admin"`, `"student-full"`, or `"student-limited"`

## 📄 License

This project is for internal class union use.

## 🤝 Support

For issues or questions, check:
1. Firebase Console for configuration errors
2. Browser console for runtime errors
3. `FIREBASE_SETUP.md` for setup details
