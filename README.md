# SoulMatch - Social App

## Project Structure

This project contains the source code for the Social Networking & Video Chat application.

- **`src/`**: React Native Application (Mobile App)
  - `api/`: API client functions
  - `components/`: Reusable UI components
  - `screens/`: Application screens
  - `services/`: Core logic services (Agora, Encryption, etc.)
  - `store/`: State management (Zustand)
  - `navigation/`: Navigation configuration

- **`web-app/`**: Next.js Public Website & Web App
  - `src/app/page.tsx`: Main Landing Page
  - `src/app/login/page.tsx`: User Login
  - `src/app/signup/page.tsx`: User Registration
  - `src/hooks/useAuth.ts`: Web Authentication Hook

- **`backend/`**: Node.js Backend Server
  - `src/controllers/`: API controllers
  - `src/services/`: Backend services
  - `src/routes/`: API routes

## Getting Started

### 1. Web App (Next.js)

Navigate to the `web-app` directory:
```bash
cd web-app
npm install
npm run dev
```
Open `http://localhost:3000` to view the landing page.
- **Login**: `/login`
- **Signup**: `/signup`
- **Dashboard**: `http://localhost:3000/dashboard` (Authenticated only)

### 2. Mobile App (React Native / Expo)

Navigate to the root directory:
```bash
npm install
npm start
```
- Scan the QR code with Expo Go.
- Press `a` for Android emulator.

### 3. Building the Android APK

To generate a standalone APK for Android devices:

```bash
# Install EAS CLI globally if you haven't already
npm install -g eas-cli

# Login to your Expo account
eas login

# Build the APK
eas build -p android --profile apk
```

Wait for the build to complete. Expo will provide a download link for the `.apk` file.

## Configuration

Ensure you have created a `.env` file in the root with your Supabase and Agora keys:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
EXPO_PUBLIC_AGORA_APP_ID=your-agora-app-id
```

## Documentation
See `../master-technical-architecture.md` and `../12-week-roadmap.md` for detailed architecture and planning.
