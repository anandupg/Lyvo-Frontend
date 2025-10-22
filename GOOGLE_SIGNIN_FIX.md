# Google Sign-in Fix Guide

## 🚨 Current Issue
Google Sign-in is failing with these errors:
- **403 Error**: `accounts.google.com/gsi/button` - Server responded with 403
- **GSI_LOGGER Error**: "The given origin is not allowed for the given client ID"

## 🔧 Root Cause
The Google OAuth client ID `864948749872-dh9vc6atlj2psgd53oiqg99kqgdbusfe.apps.googleusercontent.com` is not configured to allow your localhost origin.

## ✅ Solution Steps

### 1. Configure Google Cloud Console

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Select your project** (the one with client ID `864948749872-dh9vc6atlj2psgd53oiqg99kqgdbusfe`)
3. **Navigate to**: APIs & Services → Credentials
4. **Find your OAuth 2.0 Client ID**: `864948749872-dh9vc6atlj2psgd53oiqg99kqgdbusfe.apps.googleusercontent.com`
5. **Click Edit** (pencil icon)

### 2. Add Authorized Origins

In the **Authorized JavaScript origins** section, add:
```
http://localhost:3000
http://localhost:5173
http://127.0.0.1:3000
http://127.0.0.1:5173
```

### 3. Add Authorized Redirect URIs

In the **Authorized redirect URIs** section, add:
```
http://localhost:3000
http://localhost:5173
http://127.0.0.1:3000
http://127.0.0.1:5173
```

### 4. Save Changes

Click **Save** and wait 5-10 minutes for changes to propagate.

## 🛠️ Temporary Workaround (Already Implemented)

I've updated the Login component to:
- **Hide Google Sign-in button** when errors occur
- **Show user-friendly error messages**
- **Gracefully fallback** to email/password login
- **Handle 403 errors** specifically

## 🧪 Test the Fix

1. **Restart your frontend server**:
   ```bash
   cd Lyvo-Frontend
   npm run dev
   ```

2. **Clear browser cache** and try Google Sign-in again

3. **Check browser console** for any remaining errors

## 🔍 Verify Configuration

After making changes in Google Cloud Console, you can verify by:

1. **Check the OAuth consent screen** is configured
2. **Ensure the project has Google+ API enabled**
3. **Verify the client ID matches** what's in your `env.example`

## 📝 Environment Setup

Create a `.env` file in `Lyvo-Frontend/` with:
```env
VITE_GOOGLE_CLIENT_ID=864948749872-dh9vc6atlj2psgd53oiqg99kqgdbusfe.apps.googleusercontent.com
VITE_API_URL=http://localhost:4002/api
VITE_PROPERTY_SERVICE_API_URL=http://localhost:3002
VITE_CHAT_SERVICE_API_URL=http://localhost:3003
```

## 🚀 Production Deployment

For production (Vercel), also add these origins to Google Cloud Console:
```
https://lyvo-teal.vercel.app
https://www.lyvo-teal.vercel.app
```

## ⚠️ Important Notes

- **Changes take 5-10 minutes** to propagate
- **Clear browser cache** after making changes
- **Test in incognito mode** to avoid cached issues
- **Check browser console** for detailed error messages

## 🔧 Alternative: Disable Google Sign-in

If you want to temporarily disable Google Sign-in:

1. **Comment out** the Google Sign-in button in `Login.jsx`
2. **Set** `VITE_GOOGLE_CLIENT_ID=disabled` in your `.env`
3. **Users can still login** with email/password

---

**The Google Sign-in should work after configuring the authorized origins in Google Cloud Console!**
