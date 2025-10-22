// Test Configuration for Lyvo Login Tests
export const TEST_CONFIG = {
  // URLs
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  BACKEND_URL: process.env.BACKEND_URL || 'http://localhost:4002',
  PROPERTY_SERVICE_URL: process.env.PROPERTY_SERVICE_URL || 'http://localhost:3002',
  
  // Timeouts (in milliseconds)
  TIMEOUTS: {
    IMPLICIT: 10000,
    PAGE_LOAD: 15000,
    SCRIPT: 10000,
    ELEMENT_WAIT: 5000
  },
  
  // Browser settings
  BROWSER: {
    HEADLESS: process.env.HEADLESS === 'true',
    WINDOW_SIZE: '1920,1080',
    SLOW_MO: parseInt(process.env.SLOW_MO) || 1000
  },
  
  // Test data
  TEST_USERS: {
    seeker: {
      email: 'seeker@test.com',
      password: 'password123',
      role: 1,
      expectedRedirect: '/seeker-dashboard'
    },
    owner: {
      email: 'owner@test.com',
      password: 'password123', 
      role: 2,
      expectedRedirect: '/owner-dashboard'
    },
    admin: {
      email: 'admin@test.com',
      password: 'password123',
      role: 3,
      expectedRedirect: '/admin-dashboard'
    },
    invalid: {
      email: 'invalid@test.com',
      password: 'wrongpassword',
      role: 'invalid'
    }
  },
  
  // Selectors
  SELECTORS: {
    // Login page elements
    EMAIL_INPUT: '#email',
    PASSWORD_INPUT: '#password',
    SUBMIT_BUTTON: 'button[type="submit"]',
    GOOGLE_BUTTON: '#google-signin-button',
    FORGOT_PASSWORD_LINK: 'a[href="/forgot-password"]',
    SIGNUP_LINK: 'a[href="/signup"]',
    PASSWORD_TOGGLE: 'button[type="button"]',
    
    // Error messages
    ERROR_MESSAGE: '.bg-red-50, .text-red-700, [class*="error"]',
    
    // Success indicators
    LOGOUT_BUTTON: '[class*="logout"], [href*="logout"], button:contains("Logout")',
    USER_MENU: '[class*="user"], [class*="profile"], [class*="dashboard"]',
    
    // Page titles
    LOGIN_TITLE: 'h2',
    LOGO: 'img[alt="Lyvo Logo"]'
  },
  
  // Expected text content
  EXPECTED_TEXT: {
    LOGIN_TITLE: 'Welcome back',
    SIGN_IN_BUTTON: 'Sign in',
    SIGNING_IN_BUTTON: 'Signing in...',
    FORGOT_PASSWORD: 'Forgot your password?',
    SIGN_UP: 'Sign up',
    OR_CONTINUE_WITH_EMAIL: 'Or continue with email'
  },
  
  // Screenshots
  SCREENSHOTS: {
    DIR: './test-screenshots',
    NAMING: {
      LOGIN_PAGE: '01_login_page',
      INVALID_CREDENTIALS: '02_invalid_credentials_filled',
      INVALID_SUBMITTED: '03_invalid_login_submitted',
      VALID_CREDENTIALS: '04_{role}_credentials_filled',
      VALID_SUBMITTED: '05_{role}_login_submitted',
      PASSWORD_TOGGLE: '06_password_toggle_test',
      FORM_VALIDATION: '07_form_validation_test'
    }
  },
  
  // Test scenarios
  SCENARIOS: {
    LOGIN_PAGE_ELEMENTS: 'loginPageElements',
    INVALID_LOGIN: 'invalidLogin',
    SEEKER_LOGIN: 'seekerLogin',
    OWNER_LOGIN: 'ownerLogin', 
    ADMIN_LOGIN: 'adminLogin',
    PASSWORD_TOGGLE: 'passwordToggle',
    FORM_VALIDATION: 'formValidation'
  }
};

// Helper functions
export const TestHelpers = {
  // Generate screenshot filename
  getScreenshotName: (testName: string, counter: number) => {
    return `${counter.toString().padStart(2, '0')}_${testName}.png`;
  },
  
  // Get expected redirect URLs for a role
  getExpectedRedirects: (role: string) => {
    const redirects = {
      seeker: ['/seeker-dashboard', '/dashboard', '/seeker'],
      owner: ['/owner-dashboard', '/dashboard', '/owner'],
      admin: ['/admin-dashboard', '/dashboard', '/admin']
    };
    return redirects[role] || [];
  },
  
  // Check if URL contains any of the expected paths
  isExpectedRedirect: (currentUrl: string, expectedPaths: string[]) => {
    return expectedPaths.some(path => currentUrl.includes(path));
  },
  
  // Wait for element with custom timeout
  waitForElement: async (driver: any, selector: string, timeout: number = TEST_CONFIG.TIMEOUTS.ELEMENT_WAIT) => {
    const { until, By } = require('selenium-webdriver');
    return await driver.wait(until.elementLocated(By.css(selector)), timeout);
  },
  
  // Take screenshot with error handling
  takeScreenshot: async (driver: any, filepath: string) => {
    try {
      const data = await driver.takeScreenshot();
      const fs = require('fs');
      fs.writeFileSync(filepath, data, 'base64');
      console.log(`📸 Screenshot saved: ${filepath}`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to take screenshot: ${error.message}`);
      return false;
    }
  },
  
  // Delay execution
  delay: (ms: number = TEST_CONFIG.BROWSER.SLOW_MO) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  },
  
  // Clear and fill input field
  fillInput: async (element: any, value: string) => {
    await element.clear();
    await element.sendKeys(value);
  },
  
  // Check if element exists
  elementExists: async (driver: any, selector: string) => {
    try {
      const { By } = require('selenium-webdriver');
      await driver.findElement(By.css(selector));
      return true;
    } catch {
      return false;
    }
  }
};

export default TEST_CONFIG;
