# Selenium Login Test Failures - Fix Guide

## 🚨 Current Issue
Selenium tests are failing for **Seeker**, **Owner**, and **Admin** login tests:
- ✅ Login Page Elements: PASS
- ✅ Invalid Login: PASS  
- ❌ Seeker Login: FAIL
- ❌ Owner Login: FAIL
- ❌ Admin Login: FAIL
- ✅ Password Toggle: PASS
- ✅ Form Validation: PASS

## 🔍 Root Cause
The test users (`seeker@test.com`, `owner@test.com`, `admin@test.com`) **don't exist in your database**.

## ✅ Solution Steps

### 1. Install Dependencies
```bash
cd Lyvo-Frontend/tests
npm install
```

### 2. Create Test Users
```bash
npm run create-test-users
```

This will create the following test users:
- **seeker@test.com** (Role: Seeker, Password: password123)
- **owner@test.com** (Role: Owner, Password: password123)  
- **admin@test.com** (Role: Admin, Password: password123)

### 3. Verify Test Users Created
The script will show a summary table:
```
┌─────────────────┬─────────────────┬──────────┬─────────────┐
│ Email           │ Password        │ Role     │ Description │
├─────────────────┼─────────────────┼──────────┼─────────────┤
│ seeker@test.com │ password123     │ Seeker   │ Test Seeker │
│ owner@test.com  │ password123     │ Owner    │ Test Owner  │
│ admin@test.com  │ password123     │ Admin    │ Test Admin  │
└─────────────────┴─────────────────┴──────────┴─────────────┘
```

### 4. Run Selenium Tests Again
```bash
# Windows compatible version
python selenium/login_test_windows.py

# Or original version
python selenium/login_test.py
```

## 🛠️ Alternative: Manual User Creation

If the script doesn't work, you can manually create users via your frontend:

1. **Go to signup page**: `http://localhost:3000/signup`
2. **Create Seeker user**:
   - Email: `seeker@test.com`
   - Password: `password123`
   - Role: Seeker
3. **Go to room owner signup**: `http://localhost:3000/room-owner-signup`
4. **Create Owner user**:
   - Email: `owner@test.com`
   - Password: `password123`
   - Role: Property Owner
5. **Create Admin user** (via backend or database directly)

## 🔧 Troubleshooting

### If MongoDB Connection Fails
Make sure your user service is running:
```bash
cd Lyvo-Backend/user-service
npm start
```

### If Users Already Exist
The script will skip existing users and show:
```
⚠️  User seeker@test.com already exists, skipping...
```

### If Tests Still Fail
Check the test configuration in `test_config.json`:
- **base_url**: Should be `http://localhost:3000`
- **backend_url**: Should be `http://localhost:4002`
- **test_users**: Verify email/password combinations

## 📊 Expected Test Results After Fix

After creating test users, you should see:
```
📊 Test Results:
==================================================
Login Page Elements : ✅ PASS
Invalid Login       : ✅ PASS
Seeker Login        : ✅ PASS
Owner Login         : ✅ PASS
Admin Login         : ✅ PASS
Password Toggle     : ✅ PASS
Form Validation     : ✅ PASS

🎯 Overall: 7/7 tests passed
```

## 🚀 Quick Setup Command

Run this single command to set up everything:
```bash
cd Lyvo-Frontend/tests && npm run setup
```

This will:
1. Install all dependencies
2. Create test users in database
3. Ready for Selenium testing

---

**The Selenium login tests should pass after creating the test users!**
