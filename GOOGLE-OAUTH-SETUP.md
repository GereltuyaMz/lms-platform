# Google OAuth Setup Guide

This guide walks you through setting up Google OAuth authentication for the LMS platform.

## ✅ Prerequisites

- Google account
- Access to your Supabase project dashboard
- Development server running locally

---

## Step 1: Create Google OAuth Credentials

### 1.1 Access Google Cloud Console

Visit: https://console.cloud.google.com/

### 1.2 Create a New Project (or select existing)

1. Click the project dropdown at the top of the page
2. Click "New Project"
3. Enter project name (e.g., "LMS Platform")
4. Click "Create"
5. Wait for project creation to complete

### 1.3 Enable Google+ API

1. Go to "APIs & Services" → "Library"
2. Search for "Google+ API"
3. Click on it and click "Enable"

### 1.4 Configure OAuth Consent Screen

1. Go to "APIs & Services" → "OAuth consent screen"
2. Select "External" (allows any Google account to sign in)
3. Click "Create"
4. Fill in required fields:
   - **App name**: Your LMS Platform (or your preferred name)
   - **User support email**: Your email address
   - **Developer contact email**: Your email address
5. Click "Save and Continue"
6. **Scopes**: Skip this section, click "Save and Continue"
7. **Test users**: Add test user emails if needed (optional during development)
8. Click "Save and Continue"
9. Review summary and click "Back to Dashboard"

### 1.5 Create OAuth 2.0 Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. Select "Web application" as the application type
4. Enter a name (e.g., "LMS OAuth Client")
5. Under "Authorized redirect URIs", click "Add URI"
6. Add the following redirect URI:
   ```
   https://pedpzfvyjnkapqylfbqi.supabase.co/auth/v1/callback
   ```
7. Click "Create"
8. A dialog will appear with your **Client ID** and **Client Secret**
9. **IMPORTANT**: Copy and save both values - you'll need them in the next step

---

## Step 2: Configure Supabase

### 2.1 Access Supabase Dashboard

1. Visit: https://supabase.com/dashboard
2. Sign in to your account
3. Select your project: `pedpzfvyjnkapqylfbqi`

### 2.2 Enable Google Provider

1. In the left sidebar, go to "Authentication" → "Providers"
2. Scroll down and find "Google" in the list of providers
3. Click on "Google" to expand the settings

### 2.3 Add Google Credentials

1. Toggle "Enable Sign in with Google" to **ON**
2. Paste your **Client ID** (from Step 1.5)
3. Paste your **Client Secret** (from Step 1.5)
4. Click "Save"

### 2.4 Configure Site URL

1. Go to "Authentication" → "URL Configuration"
2. Set **Site URL**:
   - **Development**: `http://localhost:3000`
   - **Production**: Your production domain (e.g., `https://yourdomain.com`)
3. Set **Redirect URLs**:
   - `http://localhost:3000/api/auth/callback`
   - `http://localhost:3000/**`
   - Add production URLs when deploying (see Step 4)
4. Click "Save"

---

## Step 3: Test the Integration

### 3.1 Start Development Server

```bash
bun dev
```

Your app should be running at http://localhost:3000

### 3.2 Test Sign Up with Google

1. Navigate to http://localhost:3000/signup
2. Click the Google sign-in button
3. You should be redirected to Google's login page
4. Sign in with your Google account
5. Grant permissions when prompted
6. You should be redirected back to `/onboarding` page
7. Complete the onboarding wizard
8. You should land on `/dashboard`

### 3.3 Test Sign In with Google

1. Sign out from the dashboard (click your avatar → Sign Out)
2. Navigate to http://localhost:3000/signin
3. Click the Google sign-in button
4. You should be redirected to Google's login page
5. Select your Google account
6. You should be redirected directly to `/dashboard` (since onboarding is complete)

### 3.4 Verify User Profile

1. Go to your Supabase Dashboard
2. Navigate to "Table Editor" → "user_profiles"
3. You should see your user record with:
   - Email from Google
   - Full name from Google account
   - `has_completed_onboarding` set to `true`
   - Initial XP (25 from onboarding)

---

## Step 4: Production Setup (When Deploying)

### 4.1 Update Google Cloud Console

1. Go back to Google Cloud Console
2. Navigate to "APIs & Services" → "Credentials"
3. Click on your OAuth 2.0 Client ID
4. Under "Authorized JavaScript origins", add:
   ```
   https://yourdomain.com
   ```
5. Under "Authorized redirect URIs", add:
   ```
   https://pedpzfvyjnkapqylfbqi.supabase.co/auth/v1/callback
   ```
   (Note: This should already be there, but verify it)
6. Click "Save"

### 4.2 Update Supabase Configuration

1. Go to Supabase Dashboard → "Authentication" → "URL Configuration"
2. Update **Site URL** to your production domain:
   ```
   https://yourdomain.com
   ```
3. Add production redirect URLs:
   ```
   https://yourdomain.com/api/auth/callback
   https://yourdomain.com/**
   ```
4. Click "Save"

### 4.3 Verify Environment Variables

Ensure your production environment has these variables set:

```env
NEXT_PUBLIC_SUPABASE_URL=https://pedpzfvyjnkapqylfbqi.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

---

## 📊 Configuration Summary

**Supabase Project:**
- URL: `https://pedpzfvyjnkapqylfbqi.supabase.co`
- OAuth Callback: `https://pedpzfvyjnkapqylfbqi.supabase.co/auth/v1/callback`

**Authentication Flow:**
```
User clicks Google button
  ↓
Redirects to Google login
  ↓
User authenticates with Google
  ↓
Google redirects to: /api/auth/callback?code=...
  ↓
Backend exchanges code for session
  ↓
Creates/updates user profile in database
  ↓
Redirects to: /onboarding (new user) or /dashboard (existing user)
```

**User Profile Creation:**
- Full name extracted from Google user metadata
- Email from Google account
- Auto-assigned "student" role
- Initial profile marked as incomplete (prompts onboarding)

---

## 🐛 Troubleshooting

### Error: "redirect_uri_mismatch"

**Cause:** The redirect URI in your Google Cloud Console doesn't match what Supabase is using.

**Solution:**
1. Go to Google Cloud Console → Credentials
2. Verify the redirect URI is exactly:
   ```
   https://pedpzfvyjnkapqylfbqi.supabase.co/auth/v1/callback
   ```
3. No extra spaces or trailing slashes
4. Save and try again

### Error: "Access blocked: This app's request is invalid"

**Cause:** OAuth consent screen is not properly configured.

**Solution:**
1. Go to Google Cloud Console → OAuth consent screen
2. Ensure all required fields are filled
3. Verify your email is added as a test user (if app is in testing mode)
4. Publish the app if ready for production

### Error: User redirected to `/signin?error=auth_failed`

**Cause:** Session exchange failed or user profile creation failed.

**Solution:**
1. Check Supabase logs: Authentication → Logs
2. Verify Client ID and Client Secret are correct in Supabase
3. Ensure Google+ API is enabled in Google Cloud Console
4. Check if user_profiles table has proper RLS policies

### Error: Session not persisting after login

**Cause:** Cookie issues or middleware configuration.

**Solution:**
1. Clear all browser cookies for localhost
2. Verify middleware.ts is not modifying cookies incorrectly
3. Check browser console for cookie-related errors
4. Ensure Site URL in Supabase matches your current domain

### Error: "Invalid client" or "unauthorized_client"

**Cause:** Google credentials are incorrect or not properly saved.

**Solution:**
1. Go to Supabase Dashboard → Authentication → Providers → Google
2. Re-copy Client ID and Client Secret from Google Cloud Console
3. Ensure no extra spaces or characters
4. Click "Save" and test again

### Users stuck on onboarding after completing it

**Cause:** `has_completed_onboarding` flag not updating.

**Solution:**
1. Check Supabase → Table Editor → user_profiles
2. Verify the onboarding action is properly updating the flag
3. Check browser console for errors
4. Test the `/onboarding` completion flow manually

---

## 📝 Security Best Practices

1. **Never commit credentials**: Keep Client Secret in Supabase only, never in code
2. **Use environment variables**: All Supabase keys should be in `.env.local`
3. **Restrict redirect URIs**: Only add URIs you control
4. **Monitor auth logs**: Regularly check Supabase auth logs for suspicious activity
5. **Update consent screen**: Keep OAuth consent screen information accurate
6. **Test user limits**: Remove test user restrictions when going to production
7. **Enable 2FA**: Use two-factor authentication for Google Cloud Console and Supabase

---

## ✅ Post-Setup Checklist

- [ ] Google Cloud Project created
- [ ] Google+ API enabled
- [ ] OAuth consent screen configured
- [ ] OAuth 2.0 credentials created
- [ ] Client ID and Secret added to Supabase
- [ ] Site URL configured in Supabase
- [ ] Redirect URLs added in Supabase
- [ ] Tested sign up with Google
- [ ] Tested sign in with Google
- [ ] Verified user profile creation in database
- [ ] Tested onboarding flow completion
- [ ] Tested dashboard access after login

---

## 📚 Additional Resources

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Next.js Authentication Guide](https://nextjs.org/docs/authentication)

---

**Last Updated:** November 14, 2025

For questions or issues, please check the troubleshooting section or open an issue in the project repository.
