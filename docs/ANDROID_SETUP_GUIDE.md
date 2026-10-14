# PrivacyCart — Android Native App Setup & APK Build Guide

**Project:** PrivacyCart — Privacy-Preserving E-Commerce Web Application  
**Package / Application ID:** `com.privacycart.app`  
**App Name:** PrivacyCart  
**Mobile Framework:** Capacitor 8.5.3 + React 19 + Vite 8  
**Target Platform:** Android (API 26 to API 35+)

---

## 1. Project Inspection & Architecture Compatibility Report

### 1.1 Web Framework & Build Output
- **Framework:** React 19 Single Page Application (SPA), TypeScript, Tailwind CSS v4.
- **Build Output Directory:** **`dist`** (configured as `webDir: "dist"` in `capacitor.config.ts`).
- **Static Build Compatibility:** **Fully Supported.**
  - PrivacyCart is a client-side Single Page Application without server-side rendering (SSR) or server-only API endpoints.
  - Routing is handled via responsive state navigation (`currentView: 'store' | 'dashboard' | 'notice' | 'admin'`), which works seamlessly inside Android's local WebView container (`http://localhost` / `https://` scheme).
  - In Local Demonstration Mode, data persistence is maintained via the browser's persistent `localStorage`.
  - In Supabase Mode, data operations occur over standard HTTPS REST/WebSocket connections to Supabase PostgreSQL, which operate reliably inside the Android WebView container without requiring a Node.js server.

### 1.2 Android Native Setup Completed
- **Capacitor Configuration:** `capacitor.config.ts` configured with `appId: "com.privacycart.app"`, `appName: "PrivacyCart"`, and plugins for `StatusBar` and `SplashScreen`.
- **Status Bar:** Dark content style with PrivacyCart theme background color (`#1e1b4b`).
- **Splash Screen:** Center-cropped branding screen with auto-hide duration.
- **Security Hardening:** In `android/app/src/main/AndroidManifest.xml`, `android:allowBackup="false"` is enforced to prevent unauthorized data extraction via adb backups.
- **Mobile Responsive Layout:**
  - Added safe area insets (`env(safe-area-inset-top)`, `env(safe-area-inset-bottom)`) in `index.html` and `src/index.css`.
  - Added a mobile bottom navigation bar (`ShoppingBag`, `ShieldCheck`, `FileText`, `Layers`/`Personas`) in `src/components/layout/Navbar.tsx` for thumb-friendly navigation on Android phones.
  - Added mobile persona switcher for instant switching between Alice, Bob, and Admin during college presentations.

---

## 2. Current Environment Status & Requirements

During our build check, we verified the following on this Windows machine:
1. **Java Development Kit:** **Installed** (`Java SE Runtime Environment 20.0.1`).
2. **Gradle Wrapper:** **Installed and Verified** (Gradle 8.14.3 successfully downloaded and verified via `gradlew.bat --version`).
3. **Android SDK & Android Studio:** **Not Yet Installed on this PC.**
   - When running `gradlew.bat assembleDebug`, Gradle reported:
     `SDK location not found. Define a valid SDK location with an ANDROID_HOME environment variable or by setting the sdk.dir path in your project's local properties file`.

---

## 3. How to Install Android Studio & Generate the APK

To generate the `.apk` file, follow these 3 straightforward steps:

### Step 1: Install Android Studio
1. Download **Android Studio** (official free release) from:  
   👉 **[https://developer.android.com/studio](https://developer.android.com/studio)**
2. Run the installer with standard options (ensure **Android SDK**, **Android SDK Platform**, and **Android Virtual Device** are checked).
3. Open Android Studio once after installation to complete the standard SDK download (usually installs to `C:\Users\<Your-Username>\AppData\Local\Android\Sdk`).

### Step 2: Open PrivacyCart in Android Studio
From the project folder, simply run:

```powershell
npm run android:open
```
*(or launch Android Studio manually, click **File > Open**, and select the `c:\Users\Himanshi Rahangdale\Desktop\privacycart\android` directory).*

Android Studio will index the project, automatically download any missing SDK platforms (API 34/35), and sync Gradle.

### Step 3: Build the Debug APK
You have two options to generate the APK:

#### Option A: Directly from the Terminal
Once Android Studio has installed the SDK:
```powershell
npm run android:build
```
This builds the latest web assets, syncs them to Android, and compiles the APK using Gradle.

#### Option B: Inside Android Studio (Visual 1-Click)
1. In Android Studio, go to the top menu: **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
2. Once the build completes (usually 30–60 seconds), a popup will appear at the bottom-right saying **"APK(s) generated successfully"**.
3. Click **locate** to open the generated APK in Windows File Explorer!

The output APK will be located at:
📁 **`android/app/build/outputs/apk/debug/app-debug.apk`**

---

## 4. Testing on an Android Device or Emulator

### Option A: Physical Android Phone
1. Enable **Developer Options** and **USB Debugging** on your Android phone (Settings > About Phone > Tap "Build Number" 7 times).
2. Connect your phone to your PC via a USB cable.
3. In Android Studio, select your phone from the device dropdown at the top toolbar and click the green **Run (▶)** button.
4. Or transfer `app-debug.apk` to your phone via Google Drive, WhatsApp, or USB, and tap to install!

### Option B: Android Virtual Device (Emulator)
1. In Android Studio, open the **Device Manager** (phone icon in the right sidebar).
2. Click **Create Virtual Device**, select **Pixel 8**, and click **Finish**.
3. Click the green **Run (▶)** button to launch PrivacyCart on the emulator.

---

## 5. Summary of Helpful Terminal Commands

| Command | Purpose |
| :--- | :--- |
| `npm run build` | Compiles web assets to `dist/` |
| `npm run test` | Runs the 16 automated DPDP compliance tests |
| `npx cap sync android` | Copies latest web assets and plugins to `android/` |
| `npm run android:open` | Launches Android Studio with the native project |
| `npm run android:build` | Syncs assets and triggers `gradlew.bat assembleDebug` |
| `cd android && .\gradlew.bat clean` | Cleans Android build cache |
