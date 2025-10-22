# Lyvo Login Selenium Tests

This directory contains comprehensive Selenium tests for the Lyvo login functionality.

## 🚀 Quick Start

### Prerequisites

1. **Node.js** (v16 or higher)
2. **Chrome/Chromium** browser
3. **Lyvo Frontend** running on `http://localhost:5173`
4. **Lyvo Backend** services running

### Installation

```bash
# Navigate to tests directory
cd tests

# Run setup script
chmod +x setup.sh
./setup.sh

# Install dependencies
npm install
```

### Running Tests

```bash
# Run all tests
npm run test

# Run in headless mode
npm run test:headless

# Run in debug mode (slower, visible browser)
npm run test:debug

# Or run directly
node selenium/login.test.js
```

## 📋 Test Scenarios

### 1. Login Page Elements Test
- ✅ Logo presence
- ✅ Title text verification
- ✅ Email field presence
- ✅ Password field presence
- ✅ Sign in button presence
- ✅ Google sign-in button presence
- ✅ Forgot password link
- ✅ Sign up link

### 2. Invalid Login Test
- ✅ Empty form submission
- ✅ Invalid credentials
- ✅ Error message display
- ✅ Stay on login page

### 3. Valid Login Tests
- ✅ Seeker login and redirect
- ✅ Owner login and redirect
- ✅ Admin login and redirect
- ✅ Authentication verification

### 4. Password Visibility Toggle
- ✅ Password initially hidden
- ✅ Toggle to show password
- ✅ Toggle to hide password

### 5. Form Validation
- ✅ Browser validation for empty fields
- ✅ Required field validation
- ✅ Email format validation

## 🎯 Test Data

The tests use the following test users:

| Role | Email | Password | Expected Redirect |
|------|-------|----------|-------------------|
| Seeker | seeker@test.com | password123 | /seeker-dashboard |
| Owner | owner@test.com | password123 | /owner-dashboard |
| Admin | admin@test.com | password123 | /admin-dashboard |
| Invalid | invalid@test.com | wrongpassword | Stay on /login |

## 📸 Screenshots

All tests automatically capture screenshots at key moments:
- `01_login_page.png` - Initial login page
- `02_invalid_credentials_filled.png` - Invalid credentials entered
- `03_invalid_login_submitted.png` - After invalid login attempt
- `04_{role}_credentials_filled.png` - Valid credentials entered
- `05_{role}_login_submitted.png` - After valid login attempt
- `06_password_toggle_test.png` - Password visibility toggle
- `07_form_validation_test.png` - Form validation test

Screenshots are saved in `test-screenshots/` directory.

## ⚙️ Configuration

### Environment Variables

```bash
# Frontend URL (default: http://localhost:5173)
FRONTEND_URL=http://localhost:5173

# Backend URL (default: http://localhost:4002)
BACKEND_URL=http://localhost:4002

# Run in headless mode (default: false)
HEADLESS=true

# Slow down actions for debugging (default: 1000ms)
SLOW_MO=2000
```

### Test Configuration

Edit `selenium/config.js` to modify:
- Timeouts
- Selectors
- Test data
- Expected text content
- Screenshot settings

## 🔧 Troubleshooting

### Common Issues

1. **Chrome not found**
   ```bash
   # Ubuntu/Debian
   sudo apt-get install google-chrome-stable
   
   # macOS
   brew install --cask google-chrome
   
   # Windows: Download from https://www.google.com/chrome/
   ```

2. **Frontend not running**
   ```bash
   # Start frontend
   cd Lyvo-Frontend
   npm run dev
   ```

3. **Backend not running**
   ```bash
   # Start backend services
   cd Lyvo-Backend
   # Start user-service, property-service, etc.
   ```

4. **Test users not found**
   ```bash
   # Create test users in database
   node setup-test-data.js
   ```

### Debug Mode

Run tests in debug mode to see browser actions:
```bash
npm run test:debug
```

This will:
- Show browser window
- Slow down actions (2 second delay)
- Take more screenshots
- Show detailed console output

## 📊 Test Results

After running tests, you'll see:
```
📊 Test Results:
==================================================
loginPageElements    : ✅ PASS
invalidLogin         : ✅ PASS
seekerLogin          : ✅ PASS
ownerLogin           : ✅ PASS
adminLogin           : ✅ PASS
passwordToggle       : ✅ PASS
formValidation       : ✅ PASS

🎯 Overall: 7/7 tests passed
```

## 🛠️ Extending Tests

### Adding New Test Cases

1. Add new test method to `LyvoLoginTester` class
2. Add test result to `results` object in `runAllTests()`
3. Update this README with new test description

### Example New Test

```javascript
async testNewFeature() {
  console.log('🔍 Testing new feature...');
  
  try {
    // Your test logic here
    console.log('✅ New feature test passed');
    return true;
  } catch (error) {
    console.error('❌ New feature test failed:', error.message);
    await this.takeScreenshot('error_new_feature');
    return false;
  }
}
```

## 📝 Notes

- Tests are designed to be independent and can run in any order
- Screenshots help with debugging failed tests
- All tests include proper error handling and cleanup
- Tests work with both headless and visible browser modes
- Configuration is centralized for easy maintenance

## 🤝 Contributing

When adding new tests:
1. Follow the existing naming conventions
2. Include proper error handling
3. Add screenshots for debugging
4. Update this README
5. Test in both headless and visible modes
