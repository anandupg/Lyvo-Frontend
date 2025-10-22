#!/bin/bash

# Lyvo Selenium Test Setup Script
echo "🚀 Setting up Lyvo Selenium Test Environment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install test dependencies
echo "📦 Installing test dependencies..."
cd tests
npm install

# Check if Chrome is installed
if command -v google-chrome &> /dev/null; then
    echo "✅ Google Chrome is installed"
elif command -v chromium-browser &> /dev/null; then
    echo "✅ Chromium is installed"
elif command -v chrome &> /dev/null; then
    echo "✅ Chrome is installed"
else
    echo "⚠️  Chrome/Chromium not found. Please install Chrome for testing."
    echo "   On Ubuntu/Debian: sudo apt-get install google-chrome-stable"
    echo "   On macOS: brew install --cask google-chrome"
    echo "   On Windows: Download from https://www.google.com/chrome/"
fi

# Create test data setup script
echo "📝 Creating test data setup script..."
cat > setup-test-data.js << 'EOF'
const mongoose = require('mongoose');

// Test user data
const testUsers = [
  {
    email: 'seeker@test.com',
    password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password123
    role: 1, // seeker
    name: 'Test Seeker',
    phone: '1234567890',
    location: 'Test City',
    age: 25,
    occupation: 'Software Developer',
    gender: 'Male',
    isVerified: true
  },
  {
    email: 'owner@test.com',
    password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password123
    role: 2, // owner
    name: 'Test Owner',
    phone: '1234567890',
    location: 'Test City',
    isVerified: true
  },
  {
    email: 'admin@test.com',
    password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password123
    role: 3, // admin
    name: 'Test Admin',
    phone: '1234567890',
    location: 'Test City',
    isVerified: true
  }
];

async function setupTestData() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect('mongodb://localhost:27017/lyvo_user');
    
    const User = mongoose.model('User', new mongoose.Schema({
      email: String,
      password: String,
      role: Number,
      name: String,
      phone: String,
      location: String,
      age: Number,
      occupation: String,
      gender: String,
      isVerified: Boolean
    }));
    
    console.log('🗑️  Clearing existing test users...');
    await User.deleteMany({ email: { $in: testUsers.map(u => u.email) } });
    
    console.log('👥 Creating test users...');
    await User.insertMany(testUsers);
    
    console.log('✅ Test users created successfully!');
    console.log('\nTest credentials:');
    testUsers.forEach(user => {
      console.log(`${user.email} / password123 (Role: ${user.role})`);
    });
    
    await mongoose.disconnect();
    console.log('\n🎉 Test data setup complete!');
    
  } catch (error) {
    console.error('❌ Error setting up test data:', error.message);
    process.exit(1);
  }
}

setupTestData();
EOF

echo "✅ Test data setup script created"

# Create run script
echo "📝 Creating run script..."
cat > run-tests.sh << 'EOF'
#!/bin/bash

echo "🧪 Running Lyvo Login Tests..."

# Check if frontend is running
if ! curl -s http://localhost:5173 > /dev/null; then
    echo "❌ Frontend is not running on http://localhost:5173"
    echo "   Please start the frontend with: npm run dev"
    exit 1
fi

# Check if backend is running
if ! curl -s http://localhost:4002/api/health > /dev/null; then
    echo "⚠️  Backend might not be running on http://localhost:4002"
    echo "   Please start the backend services"
fi

# Run tests
echo "🚀 Starting tests..."
node login.test.js

echo "📸 Screenshots saved in: test-screenshots/"
echo "🏁 Tests completed!"
EOF

chmod +x run-tests.sh

echo "✅ Run script created"

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Make sure your Lyvo frontend is running: npm run dev"
echo "2. Make sure your backend services are running"
echo "3. Run tests: cd tests && ./run-tests.sh"
echo "4. Or run individual test: node login.test.js"
echo ""
echo "Test modes:"
echo "  npm run test          - Normal mode"
echo "  npm run test:headless - Headless mode"
echo "  npm run test:debug    - Debug mode (slower, visible browser)"
echo ""
echo "Screenshots will be saved in: tests/test-screenshots/"
