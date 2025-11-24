# 🤖 Android Build & Test Guide for JetLay

## ✅ Current Status

Your Capacitor Android project is **fully built and ready**. The web assets have been successfully compiled and synced to the Android project.

### What's Been Done:
✓ Next.js app built as static HTML (`out/` directory)  
✓ All assets copied to `android/app/src/main/assets/public/`  
✓ Capacitor configuration ready (`capacitor.config.ts`)  
✓ Android Manifest and MainActivity configured  
✓ Gradle build scripts ready  

---

## 🚀 Next Steps to Build & Test

### Prerequisites Needed:
Before building the APK, ensure you have installed:

1. **Java Development Kit (JDK)**
   - Download from: https://www.oracle.com/java/technologies/downloads/
   - Or install via: `choco install openjdk` (if using Chocolatey)
   - Set `JAVA_HOME` environment variable to your Java installation path

2. **Android SDK**
   - Install Android Studio from: https://developer.android.com/studio
   - This includes the Android SDK and build tools
   - Set `ANDROID_HOME` environment variable (usually `C:\Users\YourUsername\AppData\Local\Android\Sdk`)

3. **Gradle** (comes with Android Studio)

### Option 1: Build APK Using Android Studio (Recommended)

```bash
# Open the Android project in Android Studio
npx cap open android
```

Then in Android Studio:
1. Go to **Build → Build Bundle(s) / APK(s) → Build APK(s)**
2. Wait for the build to complete
3. The APK will be in: `android/app/build/outputs/apk/debug/`

### Option 2: Build APK from Command Line

**Windows (using gradlew.bat):**
```bash
cd android
./gradlew.bat assembleDebug
```

**Mac/Linux (using gradlew):**
```bash
cd android
./gradlew assembleDebug
```

The APK will be generated at: `android/app/build/outputs/apk/debug/app-debug.apk`

---

## 📱 Testing Options

### Option A: Physical Android Device
```bash
# Connect device via USB with USB debugging enabled
# (Settings → Developer Options → USB Debugging)

adb devices  # Verify device is connected

# Install the APK
adb install android/app/build/outputs/apk/debug/app-debug.apk

# Or use Capacitor to run directly
npx cap run android
```

### Option B: Android Emulator
```bash
# List available emulators
emulator -list-avds

# Start an emulator
emulator -avd <emulator_name>

# Build and install
npx cap run android
```

### Option C: APK Upload
- Upload the APK to Firebase Test Lab, Firebase App Distribution, or another testing service
- Share the APK file directly for testing

---

## 🔍 Build Output Details

```
Project Root
├── out/                                    # Static Next.js build
│   └── index.html                         # Main app entry point
│
├── android/
│   ├── app/
│   │   ├── build/                         # (Created after gradle build)
│   │   │   └── outputs/apk/debug/         # APK output location
│   │   │
│   │   └── src/main/
│   │       ├── assets/public/             # Web assets synced here
│   │       │   ├── index.html
│   │       │   ├── _next/
│   │       │   └── (all static files)
│   │       │
│   │       ├── AndroidManifest.xml        # App manifest
│   │       └── java/com/jetlay/app/
│   │           └── MainActivity.java      # Capacitor entry point
│   │
│   └── build.gradle                       # Gradle build config
```

---

## 🔧 Troubleshooting

### Build Fails: "JAVA_HOME is not set"
Set the JAVA_HOME environment variable:
```bash
# Windows
set JAVA_HOME=C:\Program Files\Java\jdk-17
setx JAVA_HOME C:\Program Files\Java\jdk-17

# Verify
echo %JAVA_HOME%
```

### Build Fails: "Android SDK not found"
Set the ANDROID_HOME environment variable:
```bash
# Windows
set ANDROID_HOME=C:\Users\YourUsername\AppData\Local\Android\Sdk
setx ANDROID_HOME C:\Users\YourUsername\AppData\Local\Android\Sdk

# Verify
echo %ANDROID_HOME%
```

### APK Installation Fails on Device
- Ensure USB debugging is enabled on the device
- Try: `adb uninstall com.jetlay.app` then reinstall
- Check device has enough storage space

### App Shows Blank Screen
1. Check browser console in Android Studio logcat
2. Verify all assets were synced: `ls android/app/src/main/assets/public/`
3. Check Supabase environment variables in `.env.local`

---

## 📋 Quick Commands Reference

```bash
# Development & Building
npm run dev                  # Dev server
npm run build               # Build Next.js
npm run build:android       # Build + sync (recommended)

# Capacitor Commands
npx cap sync               # Sync web assets to Android/iOS
npx cap open android       # Open Android Studio
npx cap run android        # Build APK and run on device/emulator

# Gradle Commands (from android/ folder)
./gradlew.bat assembleDebug    # Build debug APK
./gradlew.bat assembleRelease  # Build release APK
./gradlew.bat clean            # Clean build files
```

---

## 🎯 Next After Testing

Once the APK builds successfully on your device:

1. **Test all features:**
   - Authentication flows (Supabase sign-in/sign-up)
   - Document upload and display
   - Calendar and visa tracking
   - Review submission

2. **Performance testing:**
   - Check responsiveness on actual device
   - Monitor network requests
   - Test on different Android versions

3. **Release build:**
   ```bash
   cd android
   ./gradlew.bat assembleRelease
   ```
   - Create signing keystore for Play Store
   - Sign the APK for production

---

## 📞 Support Resources

- [Capacitor Android Docs](https://capacitorjs.com/docs/android)
- [Android Studio Guide](https://developer.android.com/studio/intro)
- [Gradle Build System](https://gradle.org/)
- [JetLay README](./README.md)

---

## ✨ Your App is Ready!

All the heavy lifting is done. Now you just need Java and Android SDK installed to complete the build process. 🎉
