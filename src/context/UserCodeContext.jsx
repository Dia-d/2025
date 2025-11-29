import {
  createContext, useContext, useEffect, useMemo, useState,
} from 'react';

const UserCodeContext = createContext(null);

const STORAGE_KEY = 'yonko_user_code';

export const UserCodeProvider = ({ children }) => {
  const [code, setCode] = useState(null);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setCode(stored);
    }
  }, []);

  useEffect(() => {
    if (code) {
      window.localStorage.setItem(STORAGE_KEY, code);
    }
  }, [code]);

  const clearCode = () => {
    console.log('🚪 Logging out, clearing data for user:', code);
    
    // Clear all roadmap data for this user
    if (code && typeof window !== 'undefined' && window.localStorage) {
      // Get all localStorage keys
      const keys = Object.keys(window.localStorage);
      
      // Remove all keys that belong to this user
      keys.forEach(key => {
        if (key.startsWith(`yonko_roadmap_data_${code}`)) {
          console.log('🗑️ Removing:', key);
          window.localStorage.removeItem(key);
        }
      });
    }
    
    setCode(null);
    window.localStorage.removeItem(STORAGE_KEY);
    console.log('✅ Logout complete');
  };

  const value = useMemo(() => ({ code, setCode, clearCode }), [code]);

  return <UserCodeContext.Provider value={value}>{children}</UserCodeContext.Provider>;
};

export const useUserCode = () => {
  const ctx = useContext(UserCodeContext);
  if (!ctx) {
    throw new Error('useUserCode must be used within a UserCodeProvider');
  }
  return ctx;
};


