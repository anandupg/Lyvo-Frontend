#!/usr/bin/env python3
"""
Lyvo Login Selenium Test Suite
Comprehensive testing for Lyvo login functionality using Python Selenium
"""

import os
import sys
import time
import json
import logging
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional, Tuple

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains
from selenium.common.exceptions import (
    TimeoutException, 
    NoSuchElementException, 
    WebDriverException,
    ElementNotInteractableException
)

# Configure logging with UTF-8 encoding for Windows compatibility
import io
import sys

# Create UTF-8 compatible stdout handler for Windows
if sys.platform == 'win32':
    # Wrap stdout to handle UTF-8 encoding
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('test_results.log', encoding='utf-8'),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

class LyvoLoginTester:
    """Main test class for Lyvo login functionality"""
    
    def __init__(self, config: Dict):
        self.config = config
        self.driver = None
        self.screenshot_counter = 0
        self.test_results = {}
        self.screenshot_dir = Path(config['screenshot_dir'])
        
        # Create screenshot directory
        self.screenshot_dir.mkdir(exist_ok=True)
        
    def setup_driver(self) -> bool:
        """Initialize Chrome WebDriver with proper options"""
        try:
            logger.info("🚀 Setting up Chrome WebDriver...")
            
            chrome_options = Options()
            
            # Basic Chrome options
            chrome_options.add_argument('--no-sandbox')
            chrome_options.add_argument('--disable-dev-shm-usage')
            chrome_options.add_argument('--disable-gpu')
            chrome_options.add_argument('--window-size=1920,1080')
            chrome_options.add_argument('--disable-web-security')
            chrome_options.add_argument('--allow-running-insecure-content')
            chrome_options.add_argument('--disable-extensions')
            chrome_options.add_argument('--disable-plugins')
            chrome_options.add_argument('--disable-images')  # Faster loading
            
            # Headless mode if configured
            if self.config.get('headless', False):
                chrome_options.add_argument('--headless')
                logger.info("Running in headless mode")
            
            # User agent
            chrome_options.add_argument('--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')
            
            # Initialize driver
            self.driver = webdriver.Chrome(options=chrome_options)
            
            # Set timeouts
            self.driver.implicitly_wait(self.config['timeouts']['implicit'])
            self.driver.set_page_load_timeout(self.config['timeouts']['page_load'])
            
            logger.info("✅ WebDriver setup complete")
            return True
            
        except Exception as e:
            logger.error(f"❌ Failed to setup WebDriver: {e}")
            return False
    
    def teardown_driver(self):
        """Clean up WebDriver"""
        if self.driver:
            try:
                logger.info("🔄 Closing WebDriver...")
                self.driver.quit()
                logger.info("✅ WebDriver closed")
            except Exception as e:
                logger.error(f"❌ Error closing WebDriver: {e}")
    
    def take_screenshot(self, name: str) -> bool:
        """Take screenshot with error handling"""
        if not self.driver:
            return False
            
        try:
            self.screenshot_counter += 1
            filename = f"{self.screenshot_counter:02d}_{name}.png"
            filepath = self.screenshot_dir / filename
            
            self.driver.save_screenshot(str(filepath))
            logger.info(f"📸 Screenshot saved: {filepath}")
            return True
            
        except Exception as e:
            logger.error(f"❌ Failed to take screenshot: {e}")
            return False
    
    def delay(self, seconds: Optional[float] = None):
        """Add delay between actions"""
        delay_time = seconds or self.config.get('slow_mo', 1.0)
        time.sleep(delay_time)
    
    def navigate_to_login(self) -> bool:
        """Navigate to login page"""
        try:
            logger.info("🌐 Navigating to login page...")
            self.driver.get(f"{self.config['base_url']}/login")
            
            # Wait for page to load
            WebDriverWait(self.driver, self.config['timeouts']['element_wait']).until(
                EC.presence_of_element_located((By.TAG_NAME, "body"))
            )
            
            self.take_screenshot("01_login_page")
            self.delay()
            return True
            
        except Exception as e:
            logger.error(f"❌ Failed to navigate to login page: {e}")
            return False
    
    def test_login_page_elements(self) -> bool:
        """Test if all required login page elements are present"""
        logger.info("🔍 Testing login page elements...")
        
        try:
            # Wait for page to fully load
            WebDriverWait(self.driver, self.config['timeouts']['element_wait']).until(
                EC.presence_of_element_located((By.TAG_NAME, "h2"))
            )
            
            elements_to_check = [
                ("Logo", By.CSS_SELECTOR, 'img[alt="Lyvo Logo"]'),
                ("Title", By.TAG_NAME, "h2"),
                ("Email Field", By.ID, "email"),
                ("Password Field", By.ID, "password"),
                ("Sign In Button", By.CSS_SELECTOR, 'button[type="submit"]'),
                ("Google Sign-in Button", By.ID, "google-signin-button"),
                ("Forgot Password Link", By.LINK_TEXT, "Forgot your password?"),
                ("Sign Up Link", By.LINK_TEXT, "Sign up")
            ]
            
            all_found = True
            for element_name, by, selector in elements_to_check:
                try:
                    element = self.driver.find_element(by, selector)
                    logger.info(f"✅ {element_name} found")
                    
                    # Additional checks for specific elements
                    if element_name == "Title":
                        title_text = element.text
                        if "Welcome back" in title_text:
                            logger.info(f"✅ Title text correct: {title_text}")
                        else:
                            logger.warning(f"⚠️ Title text unexpected: {title_text}")
                            
                except NoSuchElementException:
                    logger.error(f"❌ {element_name} not found")
                    all_found = False
            
            if all_found:
                logger.info("✅ All login page elements found")
            else:
                logger.error("❌ Some login page elements missing")
                
            return all_found
            
        except Exception as e:
            logger.error(f"❌ Login page elements test failed: {e}")
            self.take_screenshot("error_login_elements")
            return False
    
    def test_invalid_login(self) -> bool:
        """Test login with invalid credentials"""
        logger.info("🔍 Testing invalid login...")
        
        try:
            # Refresh page to clear any existing data
            self.driver.refresh()
            self.delay(2)
            
            # Get test user data
            invalid_user = self.config['test_users']['invalid']
            
            # Fill email field
            email_field = self.driver.find_element(By.ID, "email")
            email_field.clear()
            email_field.send_keys(invalid_user['email'])
            self.delay()
            
            # Fill password field
            password_field = self.driver.find_element(By.ID, "password")
            password_field.clear()
            password_field.send_keys(invalid_user['password'])
            self.delay()
            
            self.take_screenshot("02_invalid_credentials_filled")
            
            # Submit form
            sign_in_button = self.driver.find_element(By.CSS_SELECTOR, 'button[type="submit"]')
            sign_in_button.click()
            self.delay(3)
            
            self.take_screenshot("03_invalid_login_submitted")
            
            # Check for error message or stay on login page
            try:
                # Look for error message
                error_element = WebDriverWait(self.driver, 5).until(
                    EC.any_of(
                        EC.presence_of_element_located((By.CSS_SELECTOR, '.bg-red-50')),
                        EC.presence_of_element_located((By.CSS_SELECTOR, '.text-red-700')),
                        EC.presence_of_element_located((By.CSS_SELECTOR, '[class*="error"]'))
                    )
                )
                error_text = error_element.text
                logger.info(f"✅ Error message displayed: {error_text}")
                return True
                
            except TimeoutException:
                # Check if still on login page
                current_url = self.driver.current_url
                if "/login" in current_url:
                    logger.info("✅ Still on login page (expected for invalid login)")
                    return True
                else:
                    logger.error(f"❌ Unexpected redirect to: {current_url}")
                    return False
                    
        except Exception as e:
            logger.error(f"❌ Invalid login test failed: {e}")
            self.take_screenshot("error_invalid_login")
            return False
    
    def test_valid_login(self, user_type: str) -> bool:
        """Test login with valid credentials for specific user type"""
        logger.info(f"🔍 Testing valid login for {user_type}...")
        
        try:
            # Refresh page to clear any existing data
            self.driver.refresh()
            self.delay(2)
            
            # Get test user data
            user = self.config['test_users'][user_type]
            
            # Fill email field
            email_field = self.driver.find_element(By.ID, "email")
            email_field.clear()
            email_field.send_keys(user['email'])
            self.delay()
            
            # Fill password field
            password_field = self.driver.find_element(By.ID, "password")
            password_field.clear()
            password_field.send_keys(user['password'])
            self.delay()
            
            self.take_screenshot(f"04_{user_type}_credentials_filled")
            
            # Submit form
            sign_in_button = self.driver.find_element(By.CSS_SELECTOR, 'button[type="submit"]')
            sign_in_button.click()
            self.delay(5)
            
            self.take_screenshot(f"05_{user_type}_login_submitted")
            
            # Check for successful login (should redirect)
            current_url = self.driver.current_url
            logger.info(f"Current URL after login: {current_url}")
            
            # Expected redirects based on user role
            expected_redirects = {
                'seeker': ['/seeker-dashboard', '/dashboard', '/seeker'],
                'owner': ['/owner-dashboard', '/dashboard', '/owner'],
                'admin': ['/admin-dashboard', '/dashboard', '/admin']
            }
            
            expected_paths = expected_redirects.get(user_type, [])
            is_redirected = any(path in current_url for path in expected_paths)
            
            if is_redirected:
                logger.info(f"✅ {user_type} login successful - redirected to: {current_url}")
                
                # Check if user is logged in (look for logout button or user menu)
                try:
                    logout_element = WebDriverWait(self.driver, 5).until(
                        EC.any_of(
                            EC.presence_of_element_located((By.CSS_SELECTOR, '[class*="logout"]')),
                            EC.presence_of_element_located((By.CSS_SELECTOR, '[href*="logout"]')),
                            EC.presence_of_element_located((By.XPATH, '//button[contains(text(), "Logout")]'))
                        )
                    )
                    logger.info("✅ Logout button found - user is logged in")
                    
                except TimeoutException:
                    # Alternative check - look for user-specific elements
                    user_elements = self.driver.find_elements(By.CSS_SELECTOR, '[class*="user"], [class*="profile"], [class*="dashboard"]')
                    if user_elements:
                        logger.info("✅ User-specific elements found - user is logged in")
                    else:
                        logger.warning("⚠️ No clear logout indicator found, but redirect suggests successful login")
                
                return True
            else:
                logger.error(f"❌ {user_type} login failed - still on: {current_url}")
                return False
                
        except Exception as e:
            logger.error(f"❌ {user_type} login test failed: {e}")
            self.take_screenshot(f"error_{user_type}_login")
            return False
    
    def test_password_visibility_toggle(self) -> bool:
        """Test password visibility toggle functionality"""
        logger.info("🔍 Testing password visibility toggle...")
        
        try:
            # Navigate back to login if needed
            self.driver.get(f"{self.config['base_url']}/login")
            self.delay(2)
            
            password_field = self.driver.find_element(By.ID, "password")
            toggle_button = self.driver.find_element(By.CSS_SELECTOR, 'button[type="button"]')
            
            # Check initial state (password should be hidden)
            initial_type = password_field.get_attribute('type')
            if initial_type == 'password':
                logger.info("✅ Password field initially hidden")
            else:
                logger.error(f"❌ Password field initially visible (type: {initial_type})")
                return False
            
            # Click toggle button
            toggle_button.click()
            self.delay()
            
            # Check if password is now visible
            visible_type = password_field.get_attribute('type')
            if visible_type == 'text':
                logger.info("✅ Password field now visible")
            else:
                logger.error(f"❌ Password field not visible after toggle (type: {visible_type})")
                return False
            
            # Click toggle button again
            toggle_button.click()
            self.delay()
            
            # Check if password is hidden again
            hidden_type = password_field.get_attribute('type')
            if hidden_type == 'password':
                logger.info("✅ Password field hidden again")
            else:
                logger.error(f"❌ Password field not hidden after second toggle (type: {hidden_type})")
                return False
            
            self.take_screenshot("06_password_toggle_test")
            return True
            
        except Exception as e:
            logger.error(f"❌ Password visibility toggle test failed: {e}")
            self.take_screenshot("error_password_toggle")
            return False
    
    def test_form_validation(self) -> bool:
        """Test form validation for empty fields"""
        logger.info("🔍 Testing form validation...")
        
        try:
            # Navigate back to login if needed
            self.driver.get(f"{self.config['base_url']}/login")
            self.delay(2)
            
            # Test empty form submission
            sign_in_button = self.driver.find_element(By.CSS_SELECTOR, 'button[type="submit"]')
            sign_in_button.click()
            self.delay(1)
            
            # Check if browser validation prevents submission
            email_field = self.driver.find_element(By.ID, "email")
            password_field = self.driver.find_element(By.ID, "password")
            
            # Check if fields are marked as invalid
            email_validity = self.driver.execute_script("return arguments[0].validity.valid;", email_field)
            password_validity = self.driver.execute_script("return arguments[0].validity.valid;", password_field)
            
            if not email_validity and not password_validity:
                logger.info("✅ Form validation working - empty fields marked as invalid")
                self.take_screenshot("07_form_validation_test")
                return True
            else:
                logger.error(f"❌ Form validation not working - email: {email_validity}, password: {password_validity}")
                return False
                
        except Exception as e:
            logger.error(f"❌ Form validation test failed: {e}")
            self.take_screenshot("error_form_validation")
            return False
    
    def run_all_tests(self) -> Dict[str, bool]:
        """Run all login tests"""
        logger.info("🧪 Starting Lyvo Login Test Suite...")
        logger.info("=" * 50)
        
        # Initialize results
        self.test_results = {
            'login_page_elements': False,
            'invalid_login': False,
            'seeker_login': False,
            'owner_login': False,
            'admin_login': False,
            'password_toggle': False,
            'form_validation': False
        }
        
        try:
            # Setup WebDriver
            if not self.setup_driver():
                logger.error("❌ Failed to setup WebDriver")
                return self.test_results
            
            # Navigate to login page
            if not self.navigate_to_login():
                logger.error("❌ Failed to navigate to login page")
                return self.test_results
            
            # Test 1: Login page elements
            self.test_results['login_page_elements'] = self.test_login_page_elements()
            
            # Test 2: Invalid login
            self.test_results['invalid_login'] = self.test_invalid_login()
            
            # Test 3: Valid logins (uncomment if you have test users)
            # self.test_results['seeker_login'] = self.test_valid_login('seeker')
            # self.test_results['owner_login'] = self.test_valid_login('owner')
            # self.test_results['admin_login'] = self.test_valid_login('admin')
            
            # Test 4: Password visibility toggle
            self.test_results['password_toggle'] = self.test_password_visibility_toggle()
            
            # Test 5: Form validation
            self.test_results['form_validation'] = self.test_form_validation()
            
        except Exception as e:
            logger.error(f"❌ Test suite failed: {e}")
        finally:
            self.teardown_driver()
        
        # Print results
        self.print_results()
        return self.test_results
    
    def print_results(self):
        """Print test results summary"""
        logger.info("\n📊 Test Results:")
        logger.info("=" * 50)
        
        for test_name, passed in self.test_results.items():
            status = "✅ PASS" if passed else "❌ FAIL"
            logger.info(f"{test_name.replace('_', ' ').title().ljust(20)}: {status}")
        
        passed_tests = sum(1 for passed in self.test_results.values() if passed)
        total_tests = len(self.test_results)
        logger.info(f"\n🎯 Overall: {passed_tests}/{total_tests} tests passed")
        
        # Save results to JSON file
        results_file = self.screenshot_dir / "test_results.json"
        with open(results_file, 'w') as f:
            json.dump({
                'timestamp': datetime.now().isoformat(),
                'results': self.test_results,
                'summary': {
                    'passed': passed_tests,
                    'total': total_tests,
                    'success_rate': f"{(passed_tests/total_tests)*100:.1f}%"
                }
            }, f, indent=2)
        
        logger.info(f"📄 Detailed results saved to: {results_file}")


def load_config() -> Dict:
    """Load test configuration"""
    default_config = {
        'base_url': os.getenv('FRONTEND_URL', 'http://localhost:3000'),
        'backend_url': os.getenv('BACKEND_URL', 'http://localhost:4002'),
        'headless': os.getenv('HEADLESS', 'false').lower() == 'true',
        'slow_mo': float(os.getenv('SLOW_MO', '1.0')),
        'screenshot_dir': './test-screenshots',
        'timeouts': {
            'implicit': 10,
            'page_load': 15,
            'element_wait': 5
        },
        'test_users': {
            'seeker': {
                'email': 'seeker@test.com',
                'password': 'password123',
                'role': 'seeker'
            },
            'owner': {
                'email': 'owner@test.com',
                'password': 'password123',
                'role': 'owner'
            },
            'admin': {
                'email': 'admin@test.com',
                'password': 'password123',
                'role': 'admin'
            },
            'invalid': {
                'email': 'invalid@test.com',
                'password': 'wrongpassword',
                'role': 'invalid'
            }
        }
    }
    
    # Load from config file if exists
    config_file = Path('test_config.json')
    if config_file.exists():
        try:
            with open(config_file, 'r') as f:
                file_config = json.load(f)
                default_config.update(file_config)
                logger.info("✅ Loaded configuration from test_config.json")
        except Exception as e:
            logger.warning(f"⚠️ Failed to load config file: {e}")
    
    return default_config


def main():
    """Main function to run tests"""
    try:
        # Load configuration
        config = load_config()
        
        # Create tester instance
        tester = LyvoLoginTester(config)
        
        # Run tests
        results = tester.run_all_tests()
        
        # Exit with appropriate code
        passed_tests = sum(1 for passed in results.values() if passed)
        total_tests = len(results)
        
        if passed_tests == total_tests:
            logger.info("\n🏁 All tests passed!")
            sys.exit(0)
        else:
            logger.error(f"\n💥 {total_tests - passed_tests} tests failed!")
            sys.exit(1)
            
    except KeyboardInterrupt:
        logger.info("\n⏹️ Tests interrupted by user")
        sys.exit(1)
    except Exception as e:
        logger.error(f"\n💥 Test runner crashed: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
