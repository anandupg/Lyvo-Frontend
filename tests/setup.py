#!/usr/bin/env python3
"""
Lyvo Selenium Test Setup Script
Sets up the Python testing environment for Lyvo login tests
"""

import os
import sys
import subprocess
import platform
from pathlib import Path

def print_header():
    """Print setup header"""
    print("🚀 Lyvo Selenium Test Setup")
    print("=" * 50)

def check_python_version():
    """Check if Python version is compatible"""
    print("🐍 Checking Python version...")
    
    if sys.version_info < (3, 8):
        print("❌ Python 3.8 or higher is required")
        print(f"   Current version: {sys.version}")
        return False
    
    print(f"✅ Python {sys.version.split()[0]} is compatible")
    return True

def check_chrome():
    """Check if Chrome is installed"""
    print("🌐 Checking Chrome installation...")
    
    system = platform.system().lower()
    chrome_paths = {
        'windows': [
            r'C:\Program Files\Google\Chrome\Application\chrome.exe',
            r'C:\Program Files (x86)\Google\Chrome\Application\chrome.exe'
        ],
        'darwin': [
            '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
        ],
        'linux': [
            '/usr/bin/google-chrome',
            '/usr/bin/google-chrome-stable',
            '/usr/bin/chromium-browser',
            '/usr/bin/chromium'
        ]
    }
    
    paths = chrome_paths.get(system, [])
    
    for path in paths:
        if os.path.exists(path):
            print(f"✅ Chrome found at: {path}")
            return True
    
    print("❌ Chrome not found")
    print("   Please install Chrome:")
    if system == 'windows':
        print("   Download from: https://www.google.com/chrome/")
    elif system == 'darwin':
        print("   brew install --cask google-chrome")
    else:
        print("   sudo apt-get install google-chrome-stable")
    
    return False

def install_requirements():
    """Install Python requirements"""
    print("📦 Installing Python requirements...")
    
    requirements_file = Path(__file__).parent / "requirements.txt"
    
    if not requirements_file.exists():
        print("❌ requirements.txt not found")
        return False
    
    try:
        subprocess.check_call([
            sys.executable, "-m", "pip", "install", "-r", str(requirements_file)
        ])
        print("✅ Requirements installed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install requirements: {e}")
        return False

def create_test_data_script():
    """Create test data setup script"""
    print("📝 Creating test data setup script...")
    
    script_content = '''#!/usr/bin/env python3
"""
Test Data Setup Script for Lyvo
Creates test users in the database for Selenium tests
"""

import pymongo
import bcrypt
from datetime import datetime

# MongoDB connection
MONGO_URL = "mongodb://localhost:27017"
DATABASE_NAME = "lyvo_user"

# Test users data
TEST_USERS = [
    {
        "email": "seeker@test.com",
        "password": "password123",
        "role": 1,  # seeker
        "name": "Test Seeker",
        "phone": "1234567890",
        "location": "Test City",
        "age": 25,
        "occupation": "Software Developer",
        "gender": "Male",
        "isVerified": True,
        "createdAt": datetime.now(),
        "updatedAt": datetime.now()
    },
    {
        "email": "owner@test.com",
        "password": "password123",
        "role": 2,  # owner
        "name": "Test Owner",
        "phone": "1234567890",
        "location": "Test City",
        "isVerified": True,
        "createdAt": datetime.now(),
        "updatedAt": datetime.now()
    },
    {
        "email": "admin@test.com",
        "password": "password123",
        "role": 3,  # admin
        "name": "Test Admin",
        "phone": "1234567890",
        "location": "Test City",
        "isVerified": True,
        "createdAt": datetime.now(),
        "updatedAt": datetime.now()
    }
]

def hash_password(password):
    """Hash password using bcrypt"""
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def setup_test_data():
    """Setup test data in MongoDB"""
    try:
        print("🔗 Connecting to MongoDB...")
        client = pymongo.MongoClient(MONGO_URL)
        db = client[DATABASE_NAME]
        users_collection = db.users
        
        print("🗑️ Clearing existing test users...")
        # Remove existing test users
        test_emails = [user["email"] for user in TEST_USERS]
        users_collection.delete_many({"email": {"$in": test_emails}})
        
        print("👥 Creating test users...")
        for user in TEST_USERS:
            # Hash password
            user["password"] = hash_password(user["password"])
            
            # Insert user
            result = users_collection.insert_one(user)
            print(f"✅ Created user: {user['email']} (ID: {result.inserted_id})")
        
        print("\\n🎉 Test data setup complete!")
        print("\\nTest credentials:")
        for user in TEST_USERS:
            print(f"{user['email']} / password123 (Role: {user['role']})")
        
        client.close()
        return True
        
    except Exception as e:
        print(f"❌ Error setting up test data: {e}")
        return False

if __name__ == "__main__":
    setup_test_data()
'''
    
    script_path = Path(__file__).parent / "setup_test_data.py"
    with open(script_path, 'w') as f:
        f.write(script_content)
    
    # Make script executable on Unix systems
    if platform.system() != 'Windows':
        os.chmod(script_path, 0o755)
    
    print(f"✅ Test data setup script created: {script_path}")
    return True

def create_run_script():
    """Create test runner script"""
    print("📝 Creating test runner script...")
    
    script_content = '''#!/usr/bin/env python3
"""
Lyvo Test Runner
Runs the Selenium login tests with proper setup
"""

import os
import sys
import subprocess
import time
from pathlib import Path

def check_service(url, name):
    """Check if a service is running"""
    import requests
    try:
        response = requests.get(url, timeout=5)
        return response.status_code == 200
    except:
        return False

def main():
    print("🧪 Lyvo Login Test Runner")
    print("=" * 50)
    
    # Check if frontend is running
    frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:3000')
    if not check_service(frontend_url, 'Frontend'):
        print(f"❌ Frontend is not running on {frontend_url}")
        print("   Please start the frontend with: npm run dev")
        return False
    
    print("✅ Frontend is running")
    
    # Check if backend is running
    backend_url = os.getenv('BACKEND_URL', 'http://localhost:4002')
    if not check_service(f"{backend_url}/api/health", 'Backend'):
        print(f"⚠️ Backend might not be running on {backend_url}")
        print("   Tests may fail if backend is not available")
    else:
        print("✅ Backend is running")
    
    # Run the tests
    print("\\n🚀 Starting Selenium tests...")
    test_file = Path(__file__).parent / "selenium" / "login_test.py"
    
    try:
        result = subprocess.run([sys.executable, str(test_file)], check=True)
        print("\\n✅ Tests completed successfully!")
        return True
    except subprocess.CalledProcessError as e:
        print(f"\\n❌ Tests failed with exit code: {e.returncode}")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
'''
    
    script_path = Path(__file__).parent / "run_tests.py"
    with open(script_path, 'w') as f:
        f.write(script_content)
    
    # Make script executable on Unix systems
    if platform.system() != 'Windows':
        os.chmod(script_path, 0o755)
    
    print(f"✅ Test runner script created: {script_path}")
    return True

def create_directories():
    """Create necessary directories"""
    print("📁 Creating directories...")
    
    directories = [
        "test-screenshots",
        "test-reports",
        "test-logs"
    ]
    
    for dir_name in directories:
        dir_path = Path(__file__).parent / dir_name
        dir_path.mkdir(exist_ok=True)
        print(f"✅ Created directory: {dir_path}")
    
    return True

def main():
    """Main setup function"""
    print_header()
    
    # Check Python version
    if not check_python_version():
        sys.exit(1)
    
    # Check Chrome installation
    if not check_chrome():
        print("\\n⚠️ Chrome not found, but continuing setup...")
        print("   You'll need to install Chrome before running tests")
    
    # Create directories
    create_directories()
    
    # Install requirements
    if not install_requirements():
        sys.exit(1)
    
    # Create scripts
    create_test_data_script()
    create_run_script()
    
    print("\\n🎉 Setup complete!")
    print("\\nNext steps:")
    print("1. Make sure your Lyvo frontend is running: npm run dev")
    print("2. Make sure your backend services are running")
    print("3. Create test users: python setup_test_data.py")
    print("4. Run tests: python run_tests.py")
    print("\\nTest modes:")
    print("  python selenium/login_test.py           # Normal mode")
    print("  HEADLESS=true python selenium/login_test.py  # Headless mode")
    print("  SLOW_MO=2.0 python selenium/login_test.py    # Debug mode")
    print("\\nScreenshots will be saved in: test-screenshots/")

if __name__ == "__main__":
    main()
