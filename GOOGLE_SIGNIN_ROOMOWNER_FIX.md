# Google Sign-in Fix for RoomOwnerSignup

## 🚨 Current Issues
1. **Cross-Origin-Opener-Policy (COOP) Error**: Browser security policy blocking window.postMessage
2. **Google OAuth Configuration**: Client ID not properly configured for localhost
3. **404 Error**: Endpoint exists but Google token verification fails

## ✅ Solutions

### 1. Fix Google OAuth Configuration

**Step 1: Configure Google Cloud Console**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select project with client ID: `864948749872-dh9vc6atlj2psgd53oiqg99kqgdbusfe`
3. Navigate to: APIs & Services → Credentials
4. Edit OAuth 2.0 Client ID: `864948749872-dh9vc6atlj2psgd53oiqg99kqgdbusfe.apps.googleusercontent.com`

**Step 2: Add Authorized Origins**
```
http://localhost:3000
http://localhost:5173
http://127.0.0.1:3000
http://127.0.0.1:5173
```

**Step 3: Add Authorized Redirect URIs**
```
http://localhost:3000
http://localhost:5173
http://127.0.0.1:3000
http://127.0.0.1:5173
```

### 2. Fix Cross-Origin-Opener-Policy Error

**Option A: Update HTML Meta Tags (Recommended)**
Add to your `index.html` in the `<head>` section:
```html
<meta http-equiv="Cross-Origin-Opener-Policy" content="same-origin-allow-popups">
<meta http-equiv="Cross-Origin-Embedder-Policy" content="unsafe-none">
```

**Option B: Configure Vite for Development**
Add to your `vite.config.js`:
```javascript
export default defineConfig({
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
      'Cross-Origin-Embedder-Policy': 'unsafe-none'
    }
  }
})
```

### 3. Enhanced Error Handling

**Update RoomOwnerSignup.jsx** - Add better error handling:
```javascript
const handleGoogleSignIn = async (response) => {
  try {
    setGoogleLoading(true);
    setError(null);
    setSuccess(null);

    console.log('Google Sign-in attempt for owner...');
    
    const result = await axios.post(`${API_URL}/user/google-signin`, {
      credential: response.credential,
      role: 3, // Set role as property owner
    });

    console.log('Google Sign-in successful:', result.data);
    
    // Store user data and token
    localStorage.setItem('authToken', result.data.token);
    localStorage.setItem('user', JSON.stringify(result.data.user));
    
    // Dispatch login event to update navbar
    window.dispatchEvent(new Event('lyvo-login'));
    
    // Navigate to owner dashboard
    navigate('/owner-dashboard');
    
  } catch (err) {
    console.error('Google Sign-in error:', err);
    
    if (err.response?.status === 403) {
      setError('Google Sign-in is not configured for this domain. Please use email/password signup.');
    } else if (err.response?.status === 400) {
      setError('Invalid Google credentials. Please try again.');
    } else if (err.code === 'ERR_NETWORK') {
      setError('Network error. Please check your connection and try again.');
    } else {
      setError(err.response?.data?.message || 'Google sign-in failed. Please try email/password signup.');
    }
  } finally {
    setGoogleLoading(false);
  }
};
```

### 4. Environment Configuration

**Create/Update `.env` file in Lyvo-Frontend:**
```env
# Google OAuth Configuration
VITE_GOOGLE_CLIENT_ID=864948749872-dh9vc6atlj2psgd53oiqg99kqgdbusfe.apps.googleusercontent.com

# API Configuration - DEVELOPMENT
VITE_API_URL=http://localhost:4002/api
VITE_PROPERTY_SERVICE_API_URL=http://localhost:3002
VITE_CHAT_SERVICE_API_URL=http://localhost:5002

# Frontend Configuration
VITE_APP_NAME=Lyvo
VITE_APP_VERSION=1.0.0
```

### 5. Testing Steps

1. **Restart Backend Services:**
   ```bash
   cd Lyvo-Backend/user-service
   npm start
   ```

2. **Restart Frontend:**
   ```bash
   cd Lyvo-Frontend
   npm run dev
   ```

3. **Clear Browser Cache** and test Google Sign-in

4. **Check Browser Console** for any remaining errors

### 6. Alternative: Temporary Disable Google Sign-in

If Google Sign-in continues to fail, temporarily disable it:

**In RoomOwnerSignup.jsx:**
```javascript
// Comment out or conditionally hide Google Sign-in button
{process.env.VITE_GOOGLE_CLIENT_ID !== 'disabled' && (
  <GoogleLogin
    onSuccess={handleGoogleSignIn}
    onError={() => setError('Google Sign-in failed. Please use email/password.')}
    // ... other props
  />
)}
```

**In .env:**
```env
VITE_GOOGLE_CLIENT_ID=disabled
```

## 🔧 Root Cause Analysis

The 404 error occurs because:
1. **Google token verification fails** due to incorrect client ID configuration
2. **COOP policy blocks** the Google Sign-in popup communication
3. **Domain not authorized** in Google Cloud Console

## 🚀 Quick Fix Priority

1. **HIGH**: Configure Google Cloud Console with localhost origins
2. **HIGH**: Add COOP meta tags to index.html
3. **MEDIUM**: Update error handling in RoomOwnerSignup.jsx
4. **LOW**: Add fallback to email/password signup

---

**The Google Sign-in should work after configuring the authorized origins in Google Cloud Console!**
