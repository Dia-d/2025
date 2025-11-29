# Yonko Scholars - Complete Setup Guide

## Quick Start (2 Steps)

### Step 1: Start the Backend Server

Open a **new terminal** and run:

```bash
cd backend
python app.py
```

Or on Windows, just double-click `backend/start.bat`

You should see:
```
Successfully loaded 0 users from data.json
 * Running on http://0.0.0.0:5000
```

**Keep this terminal open!** The backend needs to stay running.

---

### Step 2: Start the Frontend

Open **another terminal** (keep the backend running) and run:

```bash
npm run dev
```

You should see:
```
VITE v6.4.1  ready in XXX ms
➜  Local:   http://localhost:5173/
```

Now open your browser to `http://localhost:5173/`

---

## How It Works

### For Users:

1. **First Visit**: 
   - User enters their name
   - System generates a unique 16-character code
   - Code is saved in browser and backend

2. **Select Subjects**:
   - Choose subjects of interest
   - Map highlights countries with matching universities

3. **Click a Country**:
   - See universities in that country
   - Filter by subjects

4. **Select a University**:
   - View personalized roadmap
   - Track requirements (Academic, Language, Documents, Visa, Financial)
   - Add notes to each requirement
   - Progress is saved automatically

5. **Return Later**:
   - Enter the same code
   - All progress and notes are restored

---

## Data Storage

### Where is data saved?

1. **Browser (localStorage)**: 
   - Immediate backup
   - Works offline
   - Stored at: `yonko_roadmap_data_<user_code>`

2. **Backend (data.json)**:
   - Persistent storage
   - Accessible from any device with the code
   - Located at: `backend/data.json`

### Data Structure:

```json
{
  "abc123xyz456": {
    "roadmaps": {
      "harvard": {
        "university_id": "harvard",
        "country_code": "US",
        "requirements": {
          "minimum_gpa": true,
          "sat_scores": false,
          "academic_transcripts": true
        },
        "notes": {
          "minimum_gpa": "Need 3.6+ GPA",
          "sat_scores": "Taking test in March"
        }
      },
      "oxford": {
        "university_id": "oxford",
        "country_code": "GB",
        "requirements": { ... },
        "notes": { ... }
      }
    }
  }
}
```

---

## Testing the System

### Test 1: Create a User
1. Open the app
2. Enter a name (e.g., "John Doe")
3. Click "Start Your Journey"
4. **Save the code shown!** (e.g., "aBc123XyZ456")

### Test 2: Track Progress
1. Select subjects (e.g., "Engineering")
2. Click on a highlighted country (e.g., USA)
3. Click on a university (e.g., "MIT")
4. Check off some requirements
5. Add notes to a requirement
6. Navigate between sections

### Test 3: Verify Backend Storage
1. Open `backend/data.json`
2. You should see your user code and data
3. Close the browser
4. Reopen and enter your code
5. All progress should be restored!

---

## Troubleshooting

### Backend won't start?

**Error: "Python is not installed"**
- Install Python 3.8+ from https://www.python.org/downloads/
- Make sure to check "Add Python to PATH" during installation

**Error: "No module named 'flask'"**
```bash
cd backend
pip install -r requirements.txt
```

**Port 5000 already in use?**
- Edit `backend/app.py`, change line:
  ```python
  app.run(host='0.0.0.0', port=5001, debug=True)
  ```
- Also update `src/context/RoadmapContext.jsx`:
  ```javascript
  const API_BASE_URL = 'http://localhost:5001/api';
  ```

### Frontend won't connect to backend?

**Check if backend is running:**
- Open http://localhost:5000/api/health
- Should see: `{"status": "healthy", "users": 0}`

**CORS errors in console?**
- Make sure `flask-cors` is installed:
  ```bash
  pip install flask-cors
  ```

### Data not saving?

**Check browser console (F12):**
- Look for errors related to "roadmap" or "fetch"
- If you see "Failed to fetch", backend might be down

**Check backend terminal:**
- Should see requests like: `PUT /api/roadmap/abc123`
- If not, frontend isn't reaching backend

---

## Production Deployment

### Backend:
- Use a production WSGI server (gunicorn, waitress)
- Replace `data.json` with a real database (PostgreSQL, MongoDB)
- Add authentication/security
- Use environment variables for configuration

### Frontend:
- Build for production: `npm run build`
- Deploy to Vercel, Netlify, or similar
- Update `VITE_API_BASE_URL` to your backend URL

---

## Features Summary

✅ Interactive world map with country highlighting
✅ Subject-based university filtering  
✅ Paginated roadmap with 5 sections
✅ Progress tracking with checkboxes
✅ Notes feature for each requirement
✅ Dependency system (must complete prerequisites)
✅ Confirmation dialog for incomplete sections
✅ Dual storage (localStorage + backend)
✅ Unique user codes for data persistence
✅ Country-specific requirements (US, GB, others)

---

## Need Help?

- Check browser console (F12) for errors
- Check backend terminal for request logs
- Verify both servers are running
- Make sure you're using the correct user code
