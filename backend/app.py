import random
import string
import json
import threading
from flask import Flask, request, jsonify
from flask_cors import CORS

# --- Basic Setup ---
app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# --- File-based Storage Configuration ---
DATA_FILE = 'data.json'
data_lock = threading.Lock()  # A lock to prevent file corruption from concurrent writes

# In-memory "database" to store user data.
# This will be loaded from the JSON file on startup.
user_data = {}

# --- Helper Functions ---

def load_data():
    """Loads user data from the JSON file into the in-memory dictionary."""
    global user_data
    try:
        with open(DATA_FILE, 'r') as f:
            user_data = json.load(f)
        print(f"Successfully loaded {len(user_data)} users from {DATA_FILE}")
    except FileNotFoundError:
        # If the file doesn't exist, start with an empty dictionary
        user_data = {}
        print(f"{DATA_FILE} not found. Starting with an empty user store.")
    except json.JSONDecodeError:
        # If the file is empty or corrupted, start with an empty dictionary
        user_data = {}
        print(f"Warning: Could not decode {DATA_FILE}. Starting with an empty user store.")

def save_data():
    """Saves the in-memory dictionary to the JSON file."""
    with data_lock:  # Acquire the lock before writing
        with open(DATA_FILE, 'w') as f:
            # Use indent=4 for a more readable file format
            json.dump(user_data, f, indent=4)

def generate_key(length=16):
    """Generates a random 16-character alphanumeric key."""
    characters = string.ascii_letters + string.digits
    return ''.join(random.choices(characters, k=length))

def find_user_or_404(user_key):
    """Helper to find a user and return a 404 error if not found."""
    if user_key not in user_data:
        return jsonify({"error": "User not found"}), 404
    return None  # Found, so no error

# --- API Endpoints ---

@app.route('/api/user', methods=['POST'])
def create_user():
    """
    Creates a new user and assigns them a 16-character key.
    Initializes with empty roadmap data. Data is saved to the file.
    """
    new_key = generate_key()
    # Ensure the key is unique (very unlikely with 16 chars, but good practice)
    while new_key in user_data:
        new_key = generate_key()
    
    user_data[new_key] = {
        'roadmaps': {}  # Store multiple roadmaps (one per university)
    }
    
    # Save the updated data to the file
    save_data()
    
    return jsonify({
        "message": "User created successfully.",
        "key": new_key
    }), 201

@app.route('/api/roadmap/<user_key>', methods=['GET'])
def get_all_roadmaps(user_key):
    """
    Retrieves all roadmaps for the user associated with the given key.
    """
    error_response = find_user_or_404(user_key)
    if error_response:
        return error_response
    
    roadmaps = user_data[user_key].get('roadmaps', {})
    return jsonify(roadmaps), 200

@app.route('/api/roadmap/<user_key>/<university_id>', methods=['GET'])
def get_roadmap(user_key, university_id):
    """
    Retrieves the roadmap for a specific university for the given user.
    """
    error_response = find_user_or_404(user_key)
    if error_response:
        return error_response
    
    roadmaps = user_data[user_key].get('roadmaps', {})
    
    if university_id not in roadmaps:
        return jsonify({"error": "Roadmap not found for this university"}), 404
    
    return jsonify(roadmaps[university_id]), 200

@app.route('/api/roadmap/<user_key>', methods=['PUT'])
def update_roadmap(user_key):
    """
    Updates or creates a roadmap for a specific university.
    Expects a JSON payload with roadmap data including university_id.
    """
    error_response = find_user_or_404(user_key)
    if error_response:
        return error_response
    
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400
    
    roadmap_data = request.get_json()
    
    if 'university_id' not in roadmap_data:
        return jsonify({"error": "Missing 'university_id' field in request body"}), 400
    
    university_id = roadmap_data['university_id']
    
    # Initialize roadmaps dict if it doesn't exist
    if 'roadmaps' not in user_data[user_key]:
        user_data[user_key]['roadmaps'] = {}
    
    # Update the roadmap for this university
    user_data[user_key]['roadmaps'][university_id] = roadmap_data
    
    # Save the updated data to the file
    save_data()
    
    return jsonify({
        "message": "Roadmap updated successfully.",
        "university_id": university_id
    }), 200

@app.route('/api/roadmap/<user_key>/<university_id>', methods=['DELETE'])
def delete_roadmap(user_key, university_id):
    """
    Deletes a roadmap for a specific university.
    """
    error_response = find_user_or_404(user_key)
    if error_response:
        return error_response
    
    roadmaps = user_data[user_key].get('roadmaps', {})
    
    if university_id not in roadmaps:
        return jsonify({"error": "Roadmap not found for this university"}), 404
    
    del user_data[user_key]['roadmaps'][university_id]
    
    # Save the updated data to the file
    save_data()
    
    return jsonify({
        "message": "Roadmap deleted successfully.",
        "university_id": university_id
    }), 200

# Health check endpoint
@app.route('/api/health', methods=['GET'])
def health_check():
    """Simple health check endpoint."""
    return jsonify({
        "status": "healthy",
        "users": len(user_data)
    }), 200

# --- Main execution block ---
if __name__ == '__main__':
    # Load existing data from the file before starting the server
    load_data()
    
    # Use 0.0.0.0 to make it accessible from other devices on your network
    # Use debug=True for development.
    app.run(host='0.0.0.0', port=5000, debug=True)
