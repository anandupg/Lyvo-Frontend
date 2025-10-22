import { Builder, By, until, WebDriver } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/chrome';
import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';

// Test configuration
const CONFIG = {
  BASE_URL: 'http://localhost:3000', // Vite default port
  TIMEOUT: 10000,
  SCREENSHOT_DIR: './test-screenshots',
  HEADLESS: false, // Set to true for headless mode
  SLOW_MO: 1000 // Delay between actions in milliseconds
};

// Test data
const TEST_USERS = {
  seeker: {
    email: 'seeker@test.com',
    password: 'password123',
    role: 'seeker'
  },
  owner: {
    email: 'owner@test.com', 
    password: 'password123',
    role: 'owner'
  },
  admin: {
    email: 'admin@test.com',
    password: 'password123',
    role: 'admin'
  },
  invalid: {
    email: 'invalid@test.com',
    password: 'wrongpassword',
    role: 'invalid'
  }
};

class LyvoLoginTester {
  private driver: WebDriver;
  private screenshotCounter = 0;

  constructor() {
    this.driver = null;
  }

  async setup() {
    console.log('🚀 Setting up Selenium WebDriver...');
    
    // Create screenshots directory
    if (!fs.existsSync(CONFIG.SCREENSHOT_DIR)) {
      fs.mkdirSync(CONFIG.SCREENSHOT_DIR, { recursive: true });
    }

    // Configure Chrome options
    const chromeOptions = new Options();
    if (CONFIG.HEADLESS) {
      chromeOptions.addArguments('--headless');
    }
    chromeOptions.addArguments('--no-sandbox');
    chromeOptions.addArguments('--disable-dev-shm-usage');
    chromeOptions.addArguments('--window-size=1920,1080');
    chromeOptions.addArguments('--disable-web-security');
    chromeOptions.addArguments('--allow-running-insecure-content');

    // Initialize WebDriver
    this.driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(chromeOptions)
      .build();

    // Set timeouts
    await this.driver.manage().setTimeouts({
      implicit: CONFIG.TIMEOUT,
      pageLoad: CONFIG.TIMEOUT,
      script: CONFIG.TIMEOUT
    });

    console.log('✅ WebDriver setup complete');
  }

  async teardown() {
    if (this.driver) {
      console.log('🔄 Closing WebDriver...');
      await this.driver.quit();
      console.log('✅ WebDriver closed');
    }
  }

  async takeScreenshot(name: string) {
    if (!this.driver) return;
    
    this.screenshotCounter++;
    const filename = `${this.screenshotCounter.toString().padStart(2, '0')}_${name}.png`;
    const filepath = path.join(CONFIG.SCREENSHOT_DIR, filename);
    
    await this.driver.takeScreenshot().then((data) => {
      fs.writeFileSync(filepath, data, 'base64');
      console.log(`📸 Screenshot saved: ${filepath}`);
    });
  }

  async delay(ms: number = CONFIG.SLOW_MO) {
    await new Promise(resolve => setTimeout(resolve, ms));
  }

  async navigateToLogin() {
    console.log('🌐 Navigating to login page...');
    await this.driver.get(`${CONFIG.BASE_URL}/login`);
    await this.driver.wait(until.titleContains('Lyvo'), CONFIG.TIMEOUT);
    await this.takeScreenshot('01_login_page');
    await this.delay();
  }

  async testLoginPageElements() {
    console.log('🔍 Testing login page elements...');
    
    try {
      // Check if page loaded
      await this.driver.wait(until.elementLocated(By.css('h2')), CONFIG.TIMEOUT);
      
      // Check logo
      const logo = await this.driver.findElement(By.css('img[alt="Lyvo Logo"]'));
      expect(logo).to.exist;
      console.log('✅ Logo found');

      // Check title
      const title = await this.driver.findElement(By.css('h2'));
      const titleText = await title.getText();
      expect(titleText).to.include('Welcome back');
      console.log('✅ Title found:', titleText);

      // Check email field
      const emailField = await this.driver.findElement(By.id('email'));
      expect(emailField).to.exist;
      console.log('✅ Email field found');

      // Check password field
      const passwordField = await this.driver.findElement(By.id('password'));
      expect(passwordField).to.exist;
      console.log('✅ Password field found');

      // Check sign in button
      const signInButton = await this.driver.findElement(By.css('button[type="submit"]'));
      expect(signInButton).to.exist;
      console.log('✅ Sign in button found');

      // Check Google sign-in button
      const googleButton = await this.driver.findElement(By.id('google-signin-button'));
      expect(googleButton).to.exist;
      console.log('✅ Google sign-in button found');

      // Check forgot password link
      const forgotPasswordLink = await this.driver.findElement(By.linkText('Forgot your password?'));
      expect(forgotPasswordLink).to.exist;
      console.log('✅ Forgot password link found');

      // Check sign up link
      const signUpLink = await this.driver.findElement(By.linkText('Sign up'));
      expect(signUpLink).to.exist;
      console.log('✅ Sign up link found');

      console.log('✅ All login page elements found');
      return true;
    } catch (error) {
      console.error('❌ Login page elements test failed:', error.message);
      await this.takeScreenshot('error_login_elements');
      return false;
    }
  }

  async testInvalidLogin() {
    console.log('🔍 Testing invalid login...');
    
    try {
      // Clear any existing data
      await this.driver.navigate().refresh();
      await this.delay(2000);

      // Fill invalid credentials
      const emailField = await this.driver.findElement(By.id('email'));
      await emailField.clear();
      await emailField.sendKeys(TEST_USERS.invalid.email);
      await this.delay();

      const passwordField = await this.driver.findElement(By.id('password'));
      await passwordField.clear();
      await passwordField.sendKeys(TEST_USERS.invalid.password);
      await this.delay();

      await this.takeScreenshot('02_invalid_credentials_filled');

      // Submit form
      const signInButton = await this.driver.findElement(By.css('button[type="submit"]'));
      await signInButton.click();
      await this.delay(3000);

      await this.takeScreenshot('03_invalid_login_submitted');

      // Check for error message
      try {
        const errorElement = await this.driver.wait(
          until.elementLocated(By.css('.bg-red-50, .text-red-700, [class*="error"]')),
          5000
        );
        const errorText = await errorElement.getText();
        console.log('✅ Error message displayed:', errorText);
        expect(errorText).to.not.be.empty;
        return true;
      } catch (error) {
        console.log('⚠️ No error message found, checking if still on login page...');
        const currentUrl = await this.driver.getCurrentUrl();
        expect(currentUrl).to.include('/login');
        console.log('✅ Still on login page (expected for invalid login)');
        return true;
      }
    } catch (error) {
      console.error('❌ Invalid login test failed:', error.message);
      await this.takeScreenshot('error_invalid_login');
      return false;
    }
  }

  async testValidLogin(userType: 'seeker' | 'owner' | 'admin') {
    console.log(`🔍 Testing valid login for ${userType}...`);
    
    try {
      // Clear any existing data
      await this.driver.navigate().refresh();
      await this.delay(2000);

      const user = TEST_USERS[userType];

      // Fill valid credentials
      const emailField = await this.driver.findElement(By.id('email'));
      await emailField.clear();
      await emailField.sendKeys(user.email);
      await this.delay();

      const passwordField = await this.driver.findElement(By.id('password'));
      await passwordField.clear();
      await passwordField.sendKeys(user.password);
      await this.delay();

      await this.takeScreenshot(`04_${userType}_credentials_filled`);

      // Submit form
      const signInButton = await this.driver.findElement(By.css('button[type="submit"]'));
      await signInButton.click();
      await this.delay(5000);

      await this.takeScreenshot(`05_${userType}_login_submitted`);

      // Check for successful login (should redirect)
      const currentUrl = await this.driver.getCurrentUrl();
      console.log('Current URL after login:', currentUrl);

      // Expected redirects based on user role
      const expectedRedirects = {
        seeker: ['/seeker-dashboard', '/dashboard', '/seeker'],
        owner: ['/owner-dashboard', '/dashboard', '/owner'],
        admin: ['/admin-dashboard', '/dashboard', '/admin']
      };

      const isRedirected = expectedRedirects[userType].some(path => currentUrl.includes(path));
      
      if (isRedirected) {
        console.log(`✅ ${userType} login successful - redirected to:`, currentUrl);
        
        // Check if user is logged in (look for logout button or user menu)
        try {
          await this.driver.wait(until.elementLocated(By.css('[class*="logout"], [href*="logout"], button:contains("Logout")')), 5000);
          console.log('✅ Logout button found - user is logged in');
        } catch {
          // Alternative check - look for user-specific elements
          const userElements = await this.driver.findElements(By.css('[class*="user"], [class*="profile"], [class*="dashboard"]'));
          if (userElements.length > 0) {
            console.log('✅ User-specific elements found - user is logged in');
          }
        }
        
        return true;
      } else {
        console.log(`❌ ${userType} login failed - still on:`, currentUrl);
        return false;
      }
    } catch (error) {
      console.error(`❌ ${userType} login test failed:`, error.message);
      await this.takeScreenshot(`error_${userType}_login`);
      return false;
    }
  }

  async testPasswordVisibilityToggle() {
    console.log('🔍 Testing password visibility toggle...');
    
    try {
      // Navigate back to login if needed
      await this.driver.get(`${CONFIG.BASE_URL}/login`);
      await this.delay(2000);

      const passwordField = await this.driver.findElement(By.id('password'));
      const toggleButton = await this.driver.findElement(By.css('button[type="button"]'));

      // Check initial state (password should be hidden)
      const initialType = await passwordField.getAttribute('type');
      expect(initialType).to.equal('password');
      console.log('✅ Password field initially hidden');

      // Click toggle button
      await toggleButton.click();
      await this.delay();

      // Check if password is now visible
      const visibleType = await passwordField.getAttribute('type');
      expect(visibleType).to.equal('text');
      console.log('✅ Password field now visible');

      // Click toggle button again
      await toggleButton.click();
      await this.delay();

      // Check if password is hidden again
      const hiddenType = await passwordField.getAttribute('type');
      expect(hiddenType).to.equal('password');
      console.log('✅ Password field hidden again');

      await this.takeScreenshot('06_password_toggle_test');
      return true;
    } catch (error) {
      console.error('❌ Password visibility toggle test failed:', error.message);
      await this.takeScreenshot('error_password_toggle');
      return false;
    }
  }

  async testFormValidation() {
    console.log('🔍 Testing form validation...');
    
    try {
      // Navigate back to login if needed
      await this.driver.get(`${CONFIG.BASE_URL}/login`);
      await this.delay(2000);

      // Test empty form submission
      const signInButton = await this.driver.findElement(By.css('button[type="submit"]'));
      await signInButton.click();
      await this.delay(1000);

      // Check if browser validation prevents submission
      const emailField = await this.driver.findElement(By.id('email'));
      const passwordField = await this.driver.findElement(By.id('password'));

      // Check if fields are marked as invalid
      const emailValidity = await this.driver.executeScript(
        'return arguments[0].validity.valid;', 
        emailField
      );
      const passwordValidity = await this.driver.executeScript(
        'return arguments[0].validity.valid;', 
        passwordField
      );

      expect(emailValidity).to.be.false;
      expect(passwordValidity).to.be.false;
      console.log('✅ Form validation working - empty fields marked as invalid');

      await this.takeScreenshot('07_form_validation_test');
      return true;
    } catch (error) {
      console.error('❌ Form validation test failed:', error.message);
      await this.takeScreenshot('error_form_validation');
      return false;
    }
  }

  async runAllTests() {
    console.log('🧪 Starting Lyvo Login Test Suite...');
    console.log('=' .repeat(50));

    const results = {
      loginPageElements: false,
      invalidLogin: false,
      seekerLogin: false,
      ownerLogin: false,
      adminLogin: false,
      passwordToggle: false,
      formValidation: false
    };

    try {
      await this.setup();
      await this.navigateToLogin();

      // Test 1: Login page elements
      results.loginPageElements = await this.testLoginPageElements();

      // Test 2: Invalid login
      results.invalidLogin = await this.testInvalidLogin();

      // Test 3: Valid logins (only test if you have test users)
      // Uncomment these if you have test users in your database
      // results.seekerLogin = await this.testValidLogin('seeker');
      // results.ownerLogin = await this.testValidLogin('owner');
      // results.adminLogin = await this.testValidLogin('admin');

      // Test 4: Password visibility toggle
      results.passwordToggle = await this.testPasswordVisibilityToggle();

      // Test 5: Form validation
      results.formValidation = await this.testFormValidation();

    } catch (error) {
      console.error('❌ Test suite failed:', error.message);
    } finally {
      await this.teardown();
    }

    // Print results
    console.log('\n📊 Test Results:');
    console.log('=' .repeat(50));
    Object.entries(results).forEach(([test, passed]) => {
      const status = passed ? '✅ PASS' : '❌ FAIL';
      console.log(`${test.padEnd(20)}: ${status}`);
    });

    const passedTests = Object.values(results).filter(Boolean).length;
    const totalTests = Object.keys(results).length;
    console.log(`\n🎯 Overall: ${passedTests}/${totalTests} tests passed`);

    return results;
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  const tester = new LyvoLoginTester();
  tester.runAllTests().then(() => {
    console.log('\n🏁 Test suite completed');
    process.exit(0);
  }).catch((error) => {
    console.error('💥 Test suite crashed:', error);
    process.exit(1);
  });
}

export default LyvoLoginTester;
