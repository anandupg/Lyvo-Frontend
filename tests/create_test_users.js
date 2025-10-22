#!/usr/bin/env node
/**
 * Create Test Users for Selenium Testing
 * This script creates the test users needed for Selenium login tests
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// User Schema (simplified version matching your backend)
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: Number, required: true }, // 1=seeker, 2=owner, 3=admin
    isVerified: { type: Boolean, default: false },
    phone: String,
    location: String,
    bio: String,
    occupation: String,
    company: String,
    workSchedule: String,
    preferredLocation: String,
    budget: Number,
    roomType: String,
    genderPreference: String,
    lifestyle: String,
    cleanliness: String,
    noiseLevel: String,
    smoking: String,
    pets: String,
    amenities: [String],
    profilePicture: String,
    googleId: String,
    isNewUser: { type: Boolean, default: true },
    hasCompletedBehaviorQuestions: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Test users configuration
const testUsers = [
    {
        name: 'Test Seeker',
        email: 'seeker@test.com',
        password: 'password123',
        role: 1, // seeker
        isVerified: true,
        phone: '+1234567890',
        location: 'Test City',
        occupation: 'Software Developer',
        bio: 'Test seeker user for Selenium testing'
    },
    {
        name: 'Test Owner',
        email: 'owner@test.com',
        password: 'password123',
        role: 2, // owner
        isVerified: true,
        phone: '+1234567891',
        location: 'Test City',
        occupation: 'Property Manager',
        bio: 'Test owner user for Selenium testing'
    },
    {
        name: 'Test Admin',
        email: 'admin@test.com',
        password: 'password123',
        role: 3, // admin
        isVerified: true,
        phone: '+1234567892',
        location: 'Test City',
        occupation: 'System Administrator',
        bio: 'Test admin user for Selenium testing'
    }
];

async function createTestUsers() {
    try {
        // Connect to MongoDB
        const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://anandupg:Anandu7710@lyvo.gy0gjrn.mongodb.net/lyvoDB?retryWrites=true&w=majority&appName=Lyvo';
        
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(mongoUri);
        console.log('✅ Connected to MongoDB');

        // Check if test users already exist
        for (const userData of testUsers) {
            const existingUser = await User.findOne({ email: userData.email });
            
            if (existingUser) {
                console.log(`⚠️  User ${userData.email} already exists, skipping...`);
                continue;
            }

            // Hash password
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

            // Create user
            const user = new User({
                ...userData,
                password: hashedPassword,
                isNewUser: false, // Mark as not new user for testing
                hasCompletedBehaviorQuestions: true // Mark as completed for testing
            });

            await user.save();
            console.log(`✅ Created test user: ${userData.email} (Role: ${userData.role})`);
        }

        console.log('\n🎉 All test users created successfully!');
        console.log('\n📋 Test Users Summary:');
        console.log('┌─────────────────┬─────────────────┬──────────┬─────────────┐');
        console.log('│ Email           │ Password        │ Role     │ Description │');
        console.log('├─────────────────┼─────────────────┼──────────┼─────────────┤');
        console.log('│ seeker@test.com │ password123     │ Seeker   │ Test Seeker │');
        console.log('│ owner@test.com  │ password123     │ Owner    │ Test Owner  │');
        console.log('│ admin@test.com  │ password123     │ Admin    │ Test Admin  │');
        console.log('└─────────────────┴─────────────────┴──────────┴─────────────┘');

        console.log('\n🧪 You can now run your Selenium tests!');
        console.log('   cd Lyvo-Frontend/tests');
        console.log('   python selenium/login_test_windows.py');

    } catch (error) {
        console.error('❌ Error creating test users:', error);
    } finally {
        // Close connection
        await mongoose.connection.close();
        console.log('🔌 Disconnected from MongoDB');
    }
}

// Run the script
if (require.main === module) {
    createTestUsers();
}

module.exports = { createTestUsers, testUsers };
