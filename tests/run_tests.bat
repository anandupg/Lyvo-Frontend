@echo off
REM Lyvo Selenium Test Runner for Windows
REM This script runs the Python Selenium tests for Lyvo login functionality

echo 🧪 Lyvo Login Test Runner (Windows)
echo =====================================

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed or not in PATH
    echo    Please install Python 3.8+ from https://python.org
    pause
    exit /b 1
)

echo ✅ Python is installed

REM Check if Chrome is installed
where chrome >nul 2>&1
if errorlevel 1 (
    echo ⚠️  Chrome not found in PATH
    echo    Please install Chrome from https://www.google.com/chrome/
    echo    Continuing anyway...
) else (
    echo ✅ Chrome is installed
)

REM Check if requirements are installed
python -c "import selenium" >nul 2>&1
if errorlevel 1 (
    echo 📦 Installing requirements...
    pip install -r requirements.txt
    if errorlevel 1 (
        echo ❌ Failed to install requirements
        pause
        exit /b 1
    )
    echo ✅ Requirements installed
) else (
    echo ✅ Requirements already installed
)

REM Check if frontend is running
echo 🔍 Checking if frontend is running...
curl -s http://localhost:3000 >nul 2>&1
if errorlevel 1 (
    echo ❌ Frontend is not running on http://localhost:3000
    echo    Please start the frontend with: npm run dev
    pause
    exit /b 1
)
echo ✅ Frontend is running

REM Check if backend is running
echo 🔍 Checking if backend is running...
curl -s http://localhost:4002/api/health >nul 2>&1
if errorlevel 1 (
    echo ⚠️  Backend might not be running on http://localhost:4002
    echo    Tests may fail if backend is not available
) else (
    echo ✅ Backend is running
)

REM Create test directories
if not exist "test-screenshots" mkdir test-screenshots
if not exist "test-reports" mkdir test-reports

echo.
echo 🚀 Starting Selenium tests...
echo.

REM Run the tests (Windows compatible version)
python selenium\login_test_windows.py

if errorlevel 1 (
    echo.
    echo ❌ Tests failed!
    echo 📸 Check screenshots in test-screenshots\ directory
    pause
    exit /b 1
) else (
    echo.
    echo ✅ Tests completed successfully!
    echo 📸 Screenshots saved in test-screenshots\ directory
)

echo.
echo 🏁 Test runner completed!
pause
