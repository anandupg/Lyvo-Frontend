import React, { useEffect, useState } from 'react';
import { getUserFromStorage, getUserFromStorageWithRepair } from '../utils/authUtils';

const RoleRepairProvider = ({ children }) => {
  const [isRepairing, setIsRepairing] = useState(false);
  const [repairComplete, setRepairComplete] = useState(false);

  useEffect(() => {
    const repairUserRole = async () => {
      try {
        setIsRepairing(true);
        console.log('🔧 RoleRepairProvider: Starting role repair...');
        
        const user = getUserFromStorage();
        if (user && (user.role === undefined || user.role === null)) {
          console.log('🔧 RoleRepairProvider: User role is undefined, attempting repair...');
          await getUserFromStorageWithRepair();
          console.log('✅ RoleRepairProvider: Role repair completed');
        } else {
          console.log('✅ RoleRepairProvider: User role is already defined');
        }
        
        setRepairComplete(true);
      } catch (error) {
        console.error('❌ RoleRepairProvider: Error during role repair:', error);
        setRepairComplete(true);
      } finally {
        setIsRepairing(false);
      }
    };

    repairUserRole();
  }, []);

  if (isRepairing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Repairing user role...</p>
        </div>
      </div>
    );
  }

  return children;
};

export default RoleRepairProvider;
