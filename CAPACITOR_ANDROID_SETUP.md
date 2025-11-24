# Capacitor Android Setup Guide

## ✅ Setup Complete

Your JetLay Next.js webapp has been successfully configured as a Capacitor Android app. Here's what was done:

### 1. **Next.js Configuration for Static Export**
- Updated `next.config.ts` with `output: 'export'` to generate static HTML files
- Disabled image optimization (`images: { unoptimized: true }`)
- Enabled trailing slash routing for cleaner URLs
- Removed duplicate `next.config.js` file

### 2. **API Routes Handling**
- Removed API routes (`src/app/api/`) since static export doesn't support server-side routes
- All your backend logic should be migrated to client-side calls to Supabase directly
- The app now uses the existing Supabase client setup for authentication and data

### 3. **Build Output**
- Next.js now generates static files in the `out/` directory
- The `out/index.html` is the entry point for your mobile app
- All assets are optimized and ready for mobile

### 4. **Capacitor Sync**
- Web assets have been synced to Android: `android/app/src/main/assets/public/`
- Capacitor configuration is set to use `out/` as the web directory
- Android manifest and MainActivity are properly configured

---

## 🚀 Building & Running

### Build for Android (without opening Android Studio)
```bash
npm run build:android
```

### Build for Android and Open in Android Studio
```bash
npm run build:android
npm run android
```
Or in one command:
```bash
npm run build && npx cap sync && npx cap run android
```

### Build for iOS
```bash
npm run build:ios
npm run ios
```

---

## 📱 Prerequisites for Running

### For Android:
- **Android Studio** installed and configured
- **Android SDK** (API level 23 minimum recommended)
- **Java Development Kit (JDK)** 11+
- **Gradle** (usually bundled with Android Studio)

### For iOS:
- **Xcode** installed
- **CocoaPods** for dependency management
- macOS environment

---

## 📝 Important Notes

### Static Export Limitations
Since the app uses static export for Capacitor:
- ❌ No server-side API routes (`src/app/api/`)
- ✅ Use Supabase directly from the client (already configured)
- ✅ All auth and data operations go through Supabase

### Supabase Integration
Your existing Supabase setup will work out of the box:
- Anon key authentication: `supabaseClient.ts`
- Real-time subscriptions: Supported
- File storage: Supported
- Database access: Via client-side SQL

### File Structure
```
JetLay/
├── src/
│   ├── app/              # Next.js pages (static)
│   ├── components/       # React components
│   ├── lib/             # Supabase clients & utilities
│   └── types/           # TypeScript types
├── out/                 # Generated static files (created on build)
├── android/             # Android project
│   └── app/src/main/
│       └── assets/
│           └── public/  # Synced web assets
├── ios/                 # iOS project
├── capacitor.config.ts  # Capacitor configuration
└── next.config.ts       # Next.js build config
```

---

## 🔧 Common Tasks

### Rebuild the web app after code changes:
```bash
npm run build
npx cap sync
```

### Test in browser first (before mobile):
```bash
npm run dev
# Open http://localhost:3000
```

### Clean rebuild (if experiencing issues):
```bash
rm -rf out/ .next/
npm run build
npx cap sync
```

### Reset Android project:
```bash
cd android
./gradlew clean
cd ..
npx cap sync
```

---

## 🐛 Troubleshooting

### "Module not found" errors
- These are expected for files in removed API routes
- Ensure `src/app/api/` doesn't exist or is removed
- Rebuild with `npm run build`

### Android app won't load web content
- Verify `out/` directory exists with `index.html`
- Check `android/app/src/main/assets/public/index.html` is present
- Run `npx cap sync` again to refresh assets

### Blank screen on Android
- Check browser console in Android Studio
- Verify Supabase environment variables are correct
- Check `process.env.NEXT_PUBLIC_SUPABASE_URL` and key are set

### Connection to Supabase fails
- Verify `.env.local` contains correct Supabase credentials:
  ```
  NEXT_PUBLIC_SUPABASE_URL=your_url
  NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
  ```
- Check network connectivity in the app

---

## 📚 Additional Resources

- **Capacitor Docs**: https://capacitorjs.com/docs
- **Next.js Static Export**: https://nextjs.org/docs/app/building-your-application/deploying/static-exports
- **Supabase Auth**: https://supabase.com/docs/guides/auth
- **Android Studio**: https://developer.android.com/studio

---

## ✨ Your App is Ready!

You can now:
1. Build the static web app: `npm run build`
2. Deploy to Android: `npm run android`
3. Test and iterate
4. Deploy to Google Play Store

Happy coding! 🚀
