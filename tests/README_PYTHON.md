# Lyvo Login Selenium Tests (Python)

This directory contains comprehensive Python-based Selenium tests for the Lyvo login functionality.

## 🚀 Quick Start

### Prerequisites

1. **Python 3.8+**
2. **Chrome/Chromium** browser
3. **Lyvo Frontend** running on `http://localhost:3000`
4. **Lyvo Backend** services running

### Installation

```bash
# Navigate to tests directory
cd tests

# Run setup script
python setup.py

# Or install manually
pip install -r requirements.txt
```

### Running Tests

```bash
# Run basic tests
python selenium/login_test.py

# Run with pytest (more features)
pytest selenium/test_login_pytest.py -v

# Run in headless mode
HEADLESS=true python selenium/login_test.py

# Run in debug mode (slower, visible browser)
SLOW_MO=2.0 python selenium/login_test.py

# Run specific test
pytest selenium/test_login_pytest.py::TestLyvoLogin::test_login_page_elements -v
```

## 📋 Test Scenarios

### Basic Tests (`login_test.py`)

1. **Login Page Elements Test**
   - ✅ Logo presence
   - ✅ Title text verification
   - ✅ Email field presence
   - ✅ Password field presence
   - ✅ Sign in button presence
   - ✅ Google sign-in button presence
   - ✅ Forgot password link
   - ✅ Sign up link

2. **Invalid Login Test**
   - ✅ Empty form submission
   - ✅ Invalid credentials
   - ✅ Error message display
   - ✅ Stay on login page

3. **Valid Login Tests**
   - ✅ Seeker login and redirect
   - ✅ Owner login and redirect
   - ✅ Admin login and redirect
   - ✅ Authentication verification

4. **Password Visibility Toggle**
   - ✅ Password initially hidden
   - ✅ Toggle to show password
   - ✅ Toggle to hide password

5. **Form Validation**
   - ✅ Browser validation for empty fields
   - ✅ Required field validation
   - ✅ Email format validation

### Advanced Tests (`test_login_pytest.py`)

1. **Parametrized Login Tests**
   - Tests multiple user types with different expected outcomes
   - Uses pytest parametrization for efficient testing

2. **Form Validation Tests**
   - Empty field validation
   - Invalid email format validation
   - Browser-level validation testing

3. **UI/UX Tests**
   - Link functionality testing
   - Responsive design testing
   - Google sign-in button testing

4. **Performance Tests**
   - Page load time testing
   - Form submission response time testing
   - Performance benchmarks

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
# Frontend URL (default: http://localhost:3000)
export FRONTEND_URL=http://localhost:3000

# Backend URL (default: http://localhost:4002)
export BACKEND_URL=http://localhost:4002

# Run in headless mode (default: false)
export HEADLESS=true

# Slow down actions for debugging (default: 1.0s)
export SLOW_MO=2.0
```

### Configuration File

Edit `test_config.json` to modify:
- URLs and endpoints
- Timeouts
- Test user data
- Browser options
- Selectors
- Expected text content

## 🔧 Test Setup

### Creating Test Users

```bash
# Create test users in database
python setup_test_data.py
```

This script will:
- Connect to MongoDB
- Create test users with hashed passwords
- Set up proper user roles and verification status

### Running Tests

```bash
# Basic test runner
python run_tests.py

# Direct test execution
python selenium/login_test.py

# Pytest execution
pytest selenium/test_login_pytest.py -v --html=test-reports/report.html
```

## 🛠️ Advanced Usage

### Pytest Features

```bash
# Run specific test class
pytest selenium/test_login_pytest.py::TestLyvoLogin -v

# Run specific test method
pytest selenium/test_login_pytest.py::TestLyvoLogin::test_login_page_elements -v

# Run with markers
pytest -m smoke selenium/test_login_pytest.py

# Run in parallel (if pytest-xdist installed)
pytest -n auto selenium/test_login_pytest.py

# Generate HTML report
pytest --html=test-reports/report.html --self-contained-html selenium/test_login_pytest.py
```

### Custom Test Configuration

```python
# Create custom config
config = {
    'base_url': 'http://localhost:3000',
    'headless': True,
    'slow_mo': 0.5,
    'test_users': {
        'custom_user': {
            'email': 'custom@test.com',
            'password': 'custompass123'
        }
    }
}

# Run tests with custom config
tester = LyvoLoginTester(config)
results = tester.run_all_tests()
```

## 📊 Test Reports

### HTML Reports (Pytest)

```bash
pytest --html=test-reports/report.html --self-contained-html selenium/test_login_pytest.py
```

### JSON Results

Test results are automatically saved to `test-screenshots/test_results.json`:

```json
{
  "timestamp": "2024-01-15T10:30:00",
  "results": {
    "login_page_elements": true,
    "invalid_login": true,
    "password_toggle": true,
    "form_validation": true
  },
  "summary": {
    "passed": 4,
    "total": 4,
    "success_rate": "100.0%"
  }
}
```

### Log Files

Detailed logs are saved to `test_results.log` with timestamps and log levels.

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
   # Create test users
   python setup_test_data.py
   ```

5. **Selenium WebDriver issues**
   ```bash
   # Update ChromeDriver
   pip install --upgrade selenium
   
   # Or use webdriver-manager
   pip install webdriver-manager
   ```

### Debug Mode

Run tests in debug mode to see browser actions:
```bash
SLOW_MO=2.0 HEADLESS=false python selenium/login_test.py
```

This will:
- Show browser window
- Slow down actions (2 second delay)
- Take more screenshots
- Show detailed console output

## 🧪 Extending Tests

### Adding New Test Cases

1. **Basic Tests**: Add new methods to `LyvoLoginTester` class
2. **Pytest Tests**: Add new test methods to `TestLyvoLogin` class

### Example New Test

```python
def test_new_feature(self, driver):
    """Test new feature"""
    # Your test logic here
    element = driver.find_element(By.ID, "new-element")
    assert element.is_displayed(), "New element should be visible"
```

### Custom Fixtures

```python
@pytest.fixture
def custom_user_data():
    """Custom user data for specific tests"""
    return {
        'email': 'custom@test.com',
        'password': 'custompass123'
    }

def test_custom_login(self, driver, custom_user_data):
    """Test with custom user data"""
    # Use custom_user_data in test
    pass
```

## 📝 Best Practices

1. **Use explicit waits** instead of `time.sleep()`
2. **Take screenshots** for debugging failed tests
3. **Clean up** after each test (delete cookies, refresh page)
4. **Use parametrization** for testing multiple scenarios
5. **Separate concerns** - UI tests vs API tests vs integration tests
6. **Use page object model** for complex applications
7. **Mock external services** when possible
8. **Run tests in CI/CD** pipeline

## 🤝 Contributing

When adding new tests:
1. Follow the existing naming conventions
2. Include proper error handling
3. Add screenshots for debugging
4. Update this README
5. Test in both headless and visible modes
6. Add appropriate pytest markers
7. Include performance considerations

## 📚 Additional Resources

- [Selenium Python Documentation](https://selenium-python.readthedocs.io/)
- [Pytest Documentation](https://docs.pytest.org/)
- [WebDriver W3C Standard](https://w3c.github.io/webdriver/)
- [Chrome DevTools Protocol](https://chromedevtools.github.io/devtools-protocol/)
