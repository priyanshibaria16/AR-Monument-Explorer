# AR Testing Guide

## How to View AR Models

The AR feature uses Google's `model-viewer` component which provides cross-platform AR support.

### Requirements for AR:

1. **Mobile Device** (Phone or Tablet)
   - iOS: iPhone or iPad with ARKit support
   - Android: Device with ARCore support

2. **Browser**:
   - iOS: Safari browser
   - Android: Chrome or Edge browser

3. **HTTPS Connection**:
   - AR requires a secure connection (HTTPS)
   - Localhost is allowed for development

4. **Camera Permissions**:
   - Grant camera access when prompted

### How to Test AR:

#### Option 1: Local Development with HTTPS

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Install a local HTTPS certificate** (or use ngrok/tunneling service):
   ```bash
   # Using mkcert (recommended)
   npm install -g mkcert
   mkcert -install
   mkcert localhost
   ```

3. **Update vite.config.ts** to use HTTPS:
   ```typescript
   import { defineConfig } from 'vite'
   import react from '@vitejs/plugin-react'
   import fs from 'fs'

   export default defineConfig({
     plugins: [react()],
     server: {
       https: {
         key: fs.readFileSync('./localhost-key.pem'),
         cert: fs.readFileSync('./localhost.pem'),
       }
     }
   })
   ```

4. **Start the dev server**:
   ```bash
   npm run dev
   ```

5. **Access from your phone**:
   - Find your computer's IP address
   - On your phone, go to: `https://YOUR_IP:5173`
   - Accept the security warning (self-signed certificate)

#### Option 2: Use ngrok (Easiest)

1. **Install ngrok**:
   ```bash
   npm install -g ngrok
   # or download from https://ngrok.com
   ```

2. **Start your dev server**:
   ```bash
   npm run dev
   ```

3. **Start ngrok tunnel**:
   ```bash
   ngrok http 5173
   ```

4. **Use the HTTPS URL** provided by ngrok on your phone

#### Option 3: Deploy to Production

1. Deploy to a hosting service (Vercel, Netlify, etc.)
2. They provide HTTPS automatically
3. Access from your phone

### Testing Steps:

1. **Open the app** on your mobile device
2. **Navigate to a monument** (e.g., Taj Mahal)
3. **Click "View in AR"** button
4. **Wait for model to load**
5. **Click the AR button** that appears on the model
6. **Grant camera permissions** when prompted
7. **Point camera at a flat surface** (floor or table)
8. **Tap to place** the monument in AR space

### Troubleshooting:

**"AR is not supported"**:
- Check if you're on a mobile device
- Check if you're using the correct browser (Safari on iOS, Chrome on Android)
- Ensure HTTPS is being used
- Check if your device supports ARCore (Android) or ARKit (iOS)

**"Camera permission denied"**:
- Go to browser settings
- Allow camera access for the site
- Refresh the page

**Model doesn't load**:
- Check internet connection (model-viewer loads from CDN)
- Check browser console for errors
- Try a different model URL

**AR button doesn't appear**:
- Ensure HTTPS is enabled
- Check browser compatibility
- Try refreshing the page

### Supported Devices:

**iOS (AR Quick Look)**:
- iPhone 6s and newer
- iPad Pro (all models)
- iPad (5th generation and newer)
- iPad Air 2 and newer
- iPad mini 4 and newer

**Android (WebXR/ARCore)**:
- Check ARCore compatibility: https://developers.google.com/ar/discover/supported-devices
- Most modern Android phones (2018+) support ARCore

### Alternative: Testing on Desktop

While AR won't work on desktop, you can:
1. View the 3D model in the viewer
2. Rotate, zoom, and interact with it
3. Test the UI/UX

The AR button will only appear on supported mobile devices.

