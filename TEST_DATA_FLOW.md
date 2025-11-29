# Test Data Flow - Step by Step

## Current Status

✅ Backend is running on port 5000
✅ Frontend is running on port 5174
✅ 2 users exist in database: `vMlix94ovYvV71ae` and `DXiWoft4TUb8kkhA`

## Problem

Data is being saved to localStorage but not to backend properly for old users.

## Solution

I've added detailed logging. Now you can see exactly what's happening!

---

## How to Test Properly

### Step 1: Clear Everything and Start Fresh

1. **Logout** (click profile icon → Logout)
2. **Clear browser data:**
   - Press F12
   - Go to "Application" tab
   - Click "Local Storage" → "http://localhost:5174"
   - Right-click → "Clear"
3. **Refresh the page**

### Step 2: Create a New User

1. Click "No, create one for me"
2. **Watch the console (F12)** - you should see:
   ```
   ✅ User created in backend: ABC123XYZ456
   ```
3. Save the code and click "I've saved it, let's go"

### Step 3: Select a University

1. Choose subjects (e.g., Engineering)
2. Click a country (e.g., USA)
3. Click a university (e.g., MIT)
4. **Watch the console** - you should see:
   ```
   🎯 Initializing roadmap for mit (US)
   ✅ Saved to localStorage: mit
   ✅ Saved to backend: mit
   ```

### Step 4: Make Changes

1. Check off a requirement
2. **Watch the console** - you should see:
   ```
   ✅ Saved to localStorage: mit
   ✅ Saved to backend: mit
   ```

3. Add a note
4. **Watch the console again** - same messages

### Step 5: Verify Data is Saved

**Method A: Check Backend Viewer**
```
http://localhost:5000/backend/test_backend.html
```
You should see your user with 1 roadmap!

**Method B: Check data.json**
Open `backend/data.json` - you should see:
```json
{
  "YOUR_CODE": {
    "roadmaps": {
      "mit": {
        "university_id": "mit",
        "country_code": "US",
        "requirements": {
          "minimum_gpa": true,
          ...
        },
        "notes": {
          "minimum_gpa": "Your note here"
        }
      }
    }
  }
}
```

### Step 6: Test Logout/Login

1. **Copy your session ID** (click profile icon)
2. **Logout**
3. **Enter your session ID** to login
4. **Go to the same university**
5. **Your progress should be restored!**

---

## What the Console Logs Mean

### ✅ Good Signs:
- `✅ User created in backend: ABC123` - User registered successfully
- `✅ Saved to localStorage: mit` - Data saved locally
- `✅ Saved to backend: mit` - Data saved to server
- `🎯 Initializing roadmap for mit (US)` - Starting new roadmap

### ⚠️ Warnings (OK):
- `⚠️ Backend not available: Failed to fetch` - Backend is down, using localStorage only
- `⚠️ Could not create user in backend` - Backend is down, using client-generated code

### ❌ Errors (Bad):
- `❌ Backend save failed: 404` - User doesn't exist in backend
- `❌ localStorage save failed` - Browser storage issue
- `⚠️ Cannot save: No user code` - Not logged in

---

## Common Issues & Solutions

### Issue: "Backend save failed: 404"

**Cause:** User was created before the fix (old session ID)

**Solution:**
1. Logout
2. Create a new user
3. The new user will be properly registered in backend

### Issue: Progress not saving

**Check:**
1. Open console (F12)
2. Look for error messages
3. If you see `❌ Backend save failed: 404`, you need to create a new user

### Issue: Progress same after logout/login

**Cause:** You're using an old session ID that wasn't registered in backend

**Solution:**
1. Create a new user (this will register in backend)
2. Use the new session ID

### Issue: Can't see data in backend viewer

**Check:**
1. Is backend running? Visit http://localhost:5000/api/health
2. Does data.json exist? Check `backend/data.json`
3. Are you using a new session ID (created after the fix)?

---

## Quick Verification Commands

### Check if backend is running:
```bash
curl http://localhost:5000/api/health
```

### View all users:
```bash
cd backend
type data.json
```

### Check backend logs:
Look at the terminal running `python app.py`

---

## Expected Behavior After Fix

1. **Create user** → User registered in backend ✅
2. **Select university** → Roadmap saved to backend ✅
3. **Check requirement** → Update saved to backend ✅
4. **Add note** → Update saved to backend ✅
5. **Logout** → Data cleared from browser ✅
6. **Login with same code** → Data restored from backend ✅
7. **Login with different code** → Different user's data ✅

---

## Summary

The fix ensures that:
- ✅ New users are created in backend
- ✅ All changes are saved to both localStorage AND backend
- ✅ Detailed console logging shows what's happening
- ✅ Logout properly clears localStorage
- ✅ Login restores data from backend

**To test:** Create a NEW user and follow the steps above!
