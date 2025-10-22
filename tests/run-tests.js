#!/usr/bin/env node

/**
 * Lyvo Login Test Runner
 * 
 * This script runs the Selenium login tests with proper setup and teardown
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
  BACKEND_URL: process.env.BACKEND_URL || 'http://localhost:4002',
  HEADLESS: process.env.HEADLESS === 'true',
  SLOW_MO: process.env.SLOW_MO || '1000',
  TEST_FILE: path.join(__dirname, 'selenium', 'login.test.js'),
  SCREENSHOT_DIR: path.join(__dirname, 'test-screenshots')
};

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkService(url, name) {
  return new Promise((resolve) => {
    const http = require('http');
    const urlObj = new URL(url);
    
    const req = http.request({
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname,
      method: 'GET',
      timeout: 5000
    }, (res) => {
      resolve(true);
    });
    
    req.on('error', () => resolve(false));
    req.on('timeout', () => resolve(false));
    req.end();
  });
}

async function preflightChecks() {
  log('🔍 Running preflight checks...', 'cyan');
  
  // Check if test file exists
  if (!fs.existsSync(CONFIG.TEST_FILE)) {
    log('❌ Test file not found: ' + CONFIG.TEST_FILE, 'red');
    return false;
  }
  
  // Check if frontend is running
  const frontendRunning = await checkService(CONFIG.FRONTEND_URL, 'Frontend');
  if (!frontendRunning) {
    log('❌ Frontend is not running on ' + CONFIG.FRONTEND_URL, 'red');
    log('   Please start the frontend with: npm run dev', 'yellow');
    return false;
  }
  log('✅ Frontend is running', 'green');
  
  // Check if backend is running
  const backendRunning = await checkService(CONFIG.BACKEND_URL + '/api/health', 'Backend');
  if (!backendRunning) {
    log('⚠️  Backend might not be running on ' + CONFIG.BACKEND_URL, 'yellow');
    log('   Tests may fail if backend is not available', 'yellow');
  } else {
    log('✅ Backend is running', 'green');
  }
  
  // Create screenshot directory
  if (!fs.existsSync(CONFIG.SCREENSHOT_DIR)) {
    fs.mkdirSync(CONFIG.SCREENSHOT_DIR, { recursive: true });
    log('📁 Created screenshot directory', 'blue');
  }
  
  return true;
}

function runTests() {
  return new Promise((resolve, reject) => {
    log('🚀 Starting Selenium tests...', 'cyan');
    
    // Set environment variables
    const env = {
      ...process.env,
      FRONTEND_URL: CONFIG.FRONTEND_URL,
      BACKEND_URL: CONFIG.BACKEND_URL,
      HEADLESS: CONFIG.HEADLESS.toString(),
      SLOW_MO: CONFIG.SLOW_MO
    };
    
    // Run the test file
    const testProcess = spawn('node', [CONFIG.TEST_FILE], {
      env,
      stdio: 'inherit',
      cwd: __dirname
    });
    
    testProcess.on('close', (code) => {
      if (code === 0) {
        log('✅ Tests completed successfully!', 'green');
        resolve(code);
      } else {
        log('❌ Tests failed with exit code: ' + code, 'red');
        reject(new Error(`Tests failed with exit code: ${code}`));
      }
    });
    
    testProcess.on('error', (error) => {
      log('❌ Failed to start tests: ' + error.message, 'red');
      reject(error);
    });
  });
}

function showResults() {
  log('\n📊 Test Results Summary:', 'bright');
  log('=' .repeat(50), 'cyan');
  
  // Check if screenshots were created
  if (fs.existsSync(CONFIG.SCREENSHOT_DIR)) {
    const screenshots = fs.readdirSync(CONFIG.SCREENSHOT_DIR);
    if (screenshots.length > 0) {
      log(`📸 ${screenshots.length} screenshots saved in: ${CONFIG.SCREENSHOT_DIR}`, 'blue');
      screenshots.forEach(screenshot => {
        log(`   - ${screenshot}`, 'blue');
      });
    }
  }
  
  log('\n🎯 Next Steps:', 'bright');
  log('1. Check screenshots for any visual issues', 'yellow');
  log('2. Review console output for detailed results', 'yellow');
  log('3. Fix any failing tests and re-run', 'yellow');
  log('4. Add new test cases as needed', 'yellow');
}

async function main() {
  try {
    log('🧪 Lyvo Login Test Runner', 'bright');
    log('=' .repeat(50), 'cyan');
    
    // Show configuration
    log('\n⚙️  Configuration:', 'cyan');
    log(`   Frontend URL: ${CONFIG.FRONTEND_URL}`, 'blue');
    log(`   Backend URL: ${CONFIG.BACKEND_URL}`, 'blue');
    log(`   Headless Mode: ${CONFIG.HEADLESS}`, 'blue');
    log(`   Slow Motion: ${CONFIG.SLOW_MO}ms`, 'blue');
    
    // Run preflight checks
    const checksPassed = await preflightChecks();
    if (!checksPassed) {
      log('\n❌ Preflight checks failed. Please fix the issues above.', 'red');
      process.exit(1);
    }
    
    log('\n✅ Preflight checks passed!', 'green');
    
    // Run tests
    await runTests();
    
    // Show results
    showResults();
    
    log('\n🏁 Test runner completed successfully!', 'green');
    
  } catch (error) {
    log('\n💥 Test runner failed: ' + error.message, 'red');
    process.exit(1);
  }
}

// Handle command line arguments
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  log('Lyvo Login Test Runner', 'bright');
  log('Usage: node run-tests.js [options]', 'cyan');
  log('\nOptions:', 'cyan');
  log('  --help, -h          Show this help message', 'blue');
  log('  --headless          Run tests in headless mode', 'blue');
  log('  --debug             Run tests in debug mode (slower)', 'blue');
  log('  --frontend-url URL  Set frontend URL (default: http://localhost:5173)', 'blue');
  log('  --backend-url URL   Set backend URL (default: http://localhost:4002)', 'blue');
  log('\nEnvironment Variables:', 'cyan');
  log('  FRONTEND_URL        Frontend URL', 'blue');
  log('  BACKEND_URL         Backend URL', 'blue');
  log('  HEADLESS            Run in headless mode (true/false)', 'blue');
  log('  SLOW_MO             Delay between actions in ms', 'blue');
  process.exit(0);
}

if (process.argv.includes('--headless')) {
  CONFIG.HEADLESS = true;
}

if (process.argv.includes('--debug')) {
  CONFIG.SLOW_MO = '2000';
  CONFIG.HEADLESS = false;
}

const frontendUrlIndex = process.argv.indexOf('--frontend-url');
if (frontendUrlIndex !== -1 && process.argv[frontendUrlIndex + 1]) {
  CONFIG.FRONTEND_URL = process.argv[frontendUrlIndex + 1];
}

const backendUrlIndex = process.argv.indexOf('--backend-url');
if (backendUrlIndex !== -1 && process.argv[backendUrlIndex + 1]) {
  CONFIG.BACKEND_URL = process.argv[backendUrlIndex + 1];
}

// Run the main function
main();
