# How to Check if Data is Being Saved to Backend

## Method 1: Use the Backend Data Viewer (Easiest) ⭐

1. **Open the viewer in your browser:**
   ```
   http://localhost:5000/backend/test_backend.html
   ```

2. **What you'll see:**
   - ✅ Backend health status
   - 📊 Number of users and roadmaps
   - 👥 List of all users with their session IDs
   - 🔍 Raw JSON data

3. **Features:**
   - Auto-refreshes every 5 seconds
   - "Refresh Data" button for manual refresh
   - "Check Health" to test backend connection
   - "Create Test User" to add a test user

---

## Method 2: Check the data.json File Directly

**Location:** `backend/data.json`

**Open it in any text editor** to see the raw data:

```json
{
  "abc123xyz456": {
    "roadmaps": {
      "harvard": {
        "university_id": "harvard",
        "country_code": "US",
        "requirements": {
          "minimum_gpa": true,
          "sat_scores": false
        },
        "notes": {
          "minimum_gpa": "Need 3.6+ GPA"
        }
      }
    }
  }
}
```

**If the file doesn't exist:** No users have been created yet.

---

## Method 3: Check Backend Logs

Look at the terminal where you ran `python app.py`:

**Good signs (data being saved):**
```
127.0.0.1 - - [29/Nov/2025 21:00:48] "PUT /api/roadmap/abc123 HTTP/1.1" 200 -
```

**Bad signs (errors):**
```
127.0.0.1 - - [29/Nov/2025 21:00:48] "PUT /api/roadmap/abc123 HTTP/1.1" 404 -
```

404 = User doesn't exist in backend

---

## Method 4: Use the Health Check API

**Open in browser:**
```
http://localhost:5000/api/health
```

**You should see:**
```json
{
  "status": "healthy",
  "users": 2
}
```

---

## Method 5: Check Browser Console

1. Open your app: http://localhost:5174
2. Press F12 to open Developer Tools
3. Go to "Console" tab
4. Look for messages like:
   - ✅ `"User created in backend: abc123xyz456"`
   - ✅ `"Roadmap updated successfully"`
   - ⚠️ `"Backend not available, using localStorage"`

---

## Method 6: Test the Full Flow

### Step-by-Step Test:

1. **Create a new user:**
   - Open http://localhost:5174
   - Click "No, create one for me"
   - Save the generated code
   - Check backend logs for: `POST /api/user HTTP/1.1" 201`

2. **Select a university:**
   - Choose subjects
   - Click a country
   - Click a university
   - Check logs for: `PUT /api/roadmap/YOUR_CODE HTTP/1.1" 200`

3. **Check requirements:**
   - Check off a requirement
   - Add a note
   - Check logs for: `PUT /api/roadmap/YOUR_CODE HTTP/1.1" 200`

4. **Verify data saved:**
   - Open `backend/data.json`
   - Search for your code
   - You should see your roadmap data!

---

## Troubleshooting

### ❌ Getting 404 errors?

**Problem:** User doesn't exist in backend

**Solution:** 
1. Logout from the app (click profile icon → Logout)
2. Create a new user (this will create them in backend)
3. Try again

### ❌ Backend not responding?

**Check:**
1. Is the backend running? Look for the terminal with `python app.py`
2. Is it on port 5000? Check the terminal output
3. Try: http://localhost:5000/api/health

### ❌ CORS errors in browser console?

**Solution:**
```bash
cd backend
pip install flask-cors
python app.py
```

### ❌ data.json file is empty `{}`?

**This is normal!** It means:
- Backend is running ✅
- No users created yet
- Create a user in the app to see data

---

## Quick Commands

### View data.json:
```bash
cd backend
type data.json
```

### Check if backend is running:
```bash
curl http://localhost:5000/api/health
```

### Create a test user:
```bash
curl -X POST http://localhost:5000/api/user
```

---

## What Data Gets Saved?

For each user, the backend stores:

```json
{
  "USER_CODE": {
    "roadmaps": {
      "UNIVERSITY_ID": {
        "university_id": "harvard",
        "country_code": "US",
        "requirements": {
          "minimum_gpa": true,
          "sat_scores": false,
          "academic_transcripts": true,
          ...
        },
        "notes": {
          "minimum_gpa": "My notes here",
          "sat_scores": "Taking test in March",
          ...
        }
      }
    }
  }
}
```

---

## Summary

**Easiest way:** Open http://localhost:5000/backend/test_backend.html

**Quick check:** Look at `backend/data.json` file

**Live monitoring:** Watch the backend terminal logs

**API test:** Visit http://localhost:5000/api/health
