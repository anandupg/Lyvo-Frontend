#!/usr/bin/env python3
"""
Pytest-based Selenium tests for Lyvo Login
More advanced testing with fixtures and parametrization
"""

import pytest
import json
import time
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import TimeoutException, NoSuchElementException

class TestLyvoLogin:
    """Test class for Lyvo login functionality"""
    
    @pytest.fixture(scope="class")
    def config(self):
        """Load test configuration"""
        config_file = Path(__file__).parent.parent / "test_config.json"
        if config_file.exists():
            with open(config_file, 'r') as f:
                return json.load(f)
        else:
            # Default configuration
            return {
                'base_url': 'http://localhost:3000',
                'headless': False,
                'slow_mo': 1.0,
                'test_users': {
                    'seeker': {'email': 'seeker@test.com', 'password': 'password123'},
                    'owner': {'email': 'owner@test.com', 'password': 'password123'},
                    'admin': {'email': 'admin@test.com', 'password': 'password123'},
                    'invalid': {'email': 'invalid@test.com', 'password': 'wrongpassword'}
                }
            }
    
    @pytest.fixture(scope="class")
    def driver(self, config):
        """Setup Chrome WebDriver"""
        chrome_options = Options()
        
        if config.get('headless', False):
            chrome_options.add_argument('--headless')
        
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-dev-shm-usage')
        chrome_options.add_argument('--window-size=1920,1080')
        
        driver = webdriver.Chrome(options=chrome_options)
        driver.implicitly_wait(10)
        
        yield driver
        
        driver.quit()
    
    @pytest.fixture(autouse=True)
    def navigate_to_login(self, driver, config):
        """Navigate to login page before each test"""
        driver.get(f"{config['base_url']}/login")
        time.sleep(config.get('slow_mo', 1.0))
        yield
        # Cleanup after each test
        driver.delete_all_cookies()
    
    def test_login_page_elements(self, driver):
        """Test that all required login page elements are present"""
        elements = [
            (By.CSS_SELECTOR, 'img[alt="Lyvo Logo"]', "Logo"),
            (By.TAG_NAME, "h2", "Title"),
            (By.ID, "email", "Email Field"),
            (By.ID, "password", "Password Field"),
            (By.CSS_SELECTOR, 'button[type="submit"]', "Sign In Button"),
            (By.ID, "google-signin-button", "Google Sign-in Button"),
            (By.LINK_TEXT, "Forgot your password?", "Forgot Password Link"),
            (By.LINK_TEXT, "Sign up", "Sign Up Link")
        ]
        
        for by, selector, name in elements:
            element = driver.find_element(by, selector)
            assert element.is_displayed(), f"{name} should be visible"
    
    def test_login_title_text(self, driver):
        """Test that login page title contains expected text"""
        title_element = driver.find_element(By.TAG_NAME, "h2")
        title_text = title_element.text
        assert "Welcome back" in title_text, f"Title should contain 'Welcome back', got: {title_text}"
    
    @pytest.mark.parametrize("user_type,expected_result", [
        ("invalid", False),
        ("seeker", True),
        ("owner", True),
        ("admin", True)
    ])
    def test_login_credentials(self, driver, config, user_type, expected_result):
        """Test login with different user credentials"""
        user = config['test_users'][user_type]
        
        # Fill email field
        email_field = driver.find_element(By.ID, "email")
        email_field.clear()
        email_field.send_keys(user['email'])
        
        # Fill password field
        password_field = driver.find_element(By.ID, "password")
        password_field.clear()
        password_field.send_keys(user['password'])
        
        # Submit form
        sign_in_button = driver.find_element(By.CSS_SELECTOR, 'button[type="submit"]')
        sign_in_button.click()
        
        # Wait for response
        time.sleep(3)
        
        current_url = driver.current_url
        
        if expected_result:
            # Should redirect away from login page
            assert "/login" not in current_url, f"Should redirect away from login page, current URL: {current_url}"
        else:
            # Should stay on login page or show error
            assert "/login" in current_url or self._has_error_message(driver), f"Should stay on login page or show error, current URL: {current_url}"
    
    def test_password_visibility_toggle(self, driver):
        """Test password visibility toggle functionality"""
        password_field = driver.find_element(By.ID, "password")
        toggle_button = driver.find_element(By.CSS_SELECTOR, 'button[type="button"]')
        
        # Check initial state
        assert password_field.get_attribute('type') == 'password', "Password should be hidden initially"
        
        # Click toggle button
        toggle_button.click()
        time.sleep(0.5)
        
        # Check if password is visible
        assert password_field.get_attribute('type') == 'text', "Password should be visible after toggle"
        
        # Click toggle button again
        toggle_button.click()
        time.sleep(0.5)
        
        # Check if password is hidden again
        assert password_field.get_attribute('type') == 'password', "Password should be hidden after second toggle"
    
    def test_form_validation_empty_fields(self, driver):
        """Test form validation for empty fields"""
        # Try to submit empty form
        sign_in_button = driver.find_element(By.CSS_SELECTOR, 'button[type="submit"]')
        sign_in_button.click()
        
        # Check if browser validation prevents submission
        email_field = driver.find_element(By.ID, "email")
        password_field = driver.find_element(By.ID, "password")
        
        email_validity = driver.execute_script("return arguments[0].validity.valid;", email_field)
        password_validity = driver.execute_script("return arguments[0].validity.valid;", password_field)
        
        assert not email_validity, "Email field should be invalid when empty"
        assert not password_validity, "Password field should be invalid when empty"
    
    def test_form_validation_invalid_email(self, driver):
        """Test form validation for invalid email format"""
        email_field = driver.find_element(By.ID, "email")
        email_field.clear()
        email_field.send_keys("invalid-email")
        
        password_field = driver.find_element(By.ID, "password")
        password_field.clear()
        password_field.send_keys("password123")
        
        # Check email validity
        email_validity = driver.execute_script("return arguments[0].validity.valid;", email_field)
        assert not email_validity, "Email field should be invalid with invalid format"
    
    def test_google_signin_button_present(self, driver):
        """Test that Google sign-in button is present and visible"""
        google_button = driver.find_element(By.ID, "google-signin-button")
        assert google_button.is_displayed(), "Google sign-in button should be visible"
    
    def test_forgot_password_link_functional(self, driver):
        """Test that forgot password link is clickable"""
        forgot_password_link = driver.find_element(By.LINK_TEXT, "Forgot your password?")
        assert forgot_password_link.is_enabled(), "Forgot password link should be clickable"
        
        # Test that it has correct href
        href = forgot_password_link.get_attribute('href')
        assert '/forgot-password' in href, f"Forgot password link should point to /forgot-password, got: {href}"
    
    def test_signup_link_functional(self, driver):
        """Test that sign up link is clickable"""
        signup_link = driver.find_element(By.LINK_TEXT, "Sign up")
        assert signup_link.is_enabled(), "Sign up link should be clickable"
        
        # Test that it has correct href
        href = signup_link.get_attribute('href')
        assert '/signup' in href, f"Sign up link should point to /signup, got: {href}"
    
    def test_responsive_design(self, driver):
        """Test that login page is responsive"""
        # Test desktop size (already set)
        assert driver.get_window_size()['width'] >= 1920, "Should be desktop size"
        
        # Test mobile size
        driver.set_window_size(375, 667)  # iPhone size
        time.sleep(1)
        
        # Check if elements are still visible
        email_field = driver.find_element(By.ID, "email")
        password_field = driver.find_element(By.ID, "password")
        sign_in_button = driver.find_element(By.CSS_SELECTOR, 'button[type="submit"]')
        
        assert email_field.is_displayed(), "Email field should be visible on mobile"
        assert password_field.is_displayed(), "Password field should be visible on mobile"
        assert sign_in_button.is_displayed(), "Sign in button should be visible on mobile"
        
        # Reset window size
        driver.set_window_size(1920, 1080)
    
    def _has_error_message(self, driver):
        """Check if error message is displayed"""
        try:
            error_selectors = [
                '.bg-red-50',
                '.text-red-700',
                '[class*="error"]'
            ]
            
            for selector in error_selectors:
                try:
                    error_element = driver.find_element(By.CSS_SELECTOR, selector)
                    if error_element.is_displayed():
                        return True
                except NoSuchElementException:
                    continue
            
            return False
        except:
            return False

# Performance tests
class TestLyvoLoginPerformance:
    """Performance tests for login functionality"""
    
    @pytest.fixture(scope="class")
    def driver(self):
        """Setup Chrome WebDriver for performance tests"""
        chrome_options = Options()
        chrome_options.add_argument('--headless')
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-dev-shm-usage')
        
        driver = webdriver.Chrome(options=chrome_options)
        driver.implicitly_wait(5)
        
        yield driver
        
        driver.quit()
    
    def test_page_load_time(self, driver):
        """Test that login page loads within acceptable time"""
        start_time = time.time()
        driver.get("http://localhost:3000/login")
        
        # Wait for page to be ready
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.TAG_NAME, "body"))
        )
        
        load_time = time.time() - start_time
        
        # Page should load within 5 seconds
        assert load_time < 5.0, f"Page load time {load_time:.2f}s exceeds 5s limit"
    
    def test_form_submission_time(self, driver):
        """Test that form submission responds within acceptable time"""
        driver.get("http://localhost:3000/login")
        
        # Fill form
        email_field = driver.find_element(By.ID, "email")
        email_field.send_keys("test@example.com")
        
        password_field = driver.find_element(By.ID, "password")
        password_field.send_keys("password123")
        
        # Measure submission time
        start_time = time.time()
        sign_in_button = driver.find_element(By.CSS_SELECTOR, 'button[type="submit"]')
        sign_in_button.click()
        
        # Wait for response (error or redirect)
        try:
            WebDriverWait(driver, 5).until(
                EC.any_of(
                    EC.presence_of_element_located((By.CSS_SELECTOR, '.bg-red-50')),
                    EC.url_changes(driver.current_url)
                )
            )
        except TimeoutException:
            pass  # Some responses might take longer
        
        response_time = time.time() - start_time
        
        # Form should respond within 3 seconds
        assert response_time < 3.0, f"Form submission time {response_time:.2f}s exceeds 3s limit"
