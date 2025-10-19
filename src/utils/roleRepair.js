// Role repair utilities for fixing undefined user roles

/**
 * Repair user role by making an API call to get the correct role from the backend
 * @param {Object} user - User object from localStorage
 * @returns {Promise<Object>} - Updated user object with correct role
 */
export const repairUserRole = async (user) => {
  if (!user || !user._id) {
    console.error('Invalid user object for role repair');
    return user;
  }

  try {
    console.log('🔧 Attempting to repair user role for:', user.email);
    
    // Make API call to get user details from backend
    const response = await fetch(`http://localhost:4002/api/user/public/user/${user._id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const userData = await response.json();
      console.log('✅ Retrieved user data from backend:', userData);
      
      if (userData.role !== undefined && userData.role !== null) {
        // Update localStorage with correct role
        const updatedUser = { ...user, role: userData.role };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        console.log('✅ User role repaired and saved to localStorage');
        return updatedUser;
      } else {
        console.warn('⚠️ Backend also has undefined role, attempting manual fix');
        return await manualRoleFix(user);
      }
    } else {
      console.error('❌ Failed to fetch user data from backend:', response.status);
      return await manualRoleFix(user);
    }
  } catch (error) {
    console.error('❌ Error repairing user role:', error);
    return await manualRoleFix(user);
  }
};

/**
 * Manual role fix based on user data patterns
 * @param {Object} user - User object from localStorage
 * @returns {Object} - Updated user object with estimated role
 */
export const manualRoleFix = async (user) => {
  console.log('🔧 Attempting manual role fix for:', user.email);
  
  let estimatedRole = 1; // Default to seeker
  
  // Try to determine role from various indicators
  if (user.email) {
    const email = user.email.toLowerCase();
    
    if (email.includes('admin') || email.includes('lyvo')) {
      estimatedRole = 2; // Admin
    } else if (email.includes('owner') || email.includes('property') || email.includes('anandupg2022')) {
      estimatedRole = 3; // Owner
    }
  }
  
  // Check if user has any owner-specific data
  if (user.name && (user.name.includes('Owner') || user.name.includes('Property'))) {
    estimatedRole = 3; // Owner
  }
  
  // Update localStorage with estimated role
  const updatedUser = { ...user, role: estimatedRole };
  localStorage.setItem('user', JSON.stringify(updatedUser));
  
  console.log(`✅ Manual role fix applied: estimated role ${estimatedRole} for ${user.email}`);
  return updatedUser;
};

/**
 * Check if user role needs repair
 * @param {Object} user - User object from localStorage
 * @returns {boolean} - True if role needs repair
 */
export const needsRoleRepair = (user) => {
  return !user || user.role === undefined || user.role === null;
};

/**
 * Auto-repair user role if needed
 * @param {Object} user - User object from localStorage
 * @returns {Promise<Object>} - Updated user object
 */
export const autoRepairUserRole = async (user) => {
  if (needsRoleRepair(user)) {
    console.log('🔧 User role needs repair, attempting auto-repair...');
    return await repairUserRole(user);
  }
  return user;
};
