# Yonko Scholars Backend

Flask backend for storing user roadmap data.

## Setup

1. Install Python 3.8 or higher
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Running the Server

```bash
python app.py
```

The server will start on `http://localhost:5000`

## API Endpoints

### Create User
- **POST** `/api/user`
- Creates a new user and returns a unique key
- Response: `{ "key": "abc123...", "message": "User created successfully." }`

### Get All Roadmaps
- **GET** `/api/roadmap/<user_key>`
- Returns all roadmaps for a user

### Get Specific Roadmap
- **GET** `/api/roadmap/<user_key>/<university_id>`
- Returns roadmap for a specific university

### Update Roadmap
- **PUT** `/api/roadmap/<user_key>`
- Updates or creates a roadmap
- Body: `{ "university_id": "harvard", "country_code": "US", "requirements": {...}, "notes": {...} }`

### Delete Roadmap
- **DELETE** `/api/roadmap/<user_key>/<university_id>`
- Deletes a roadmap for a specific university

### Health Check
- **GET** `/api/health`
- Returns server status

## Data Storage

Data is stored in `data.json` in the following format:

```json
{
  "user_key_123": {
    "roadmaps": {
      "harvard": {
        "university_id": "harvard",
        "country_code": "US",
        "requirements": {
          "minimum_gpa": true,
          "sat_scores": false
        },
        "notes": {
          "minimum_gpa": "Need to submit by March"
        }
      }
    }
  }
}
```
