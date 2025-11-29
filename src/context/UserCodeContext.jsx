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

  const value = useMemo(() => ({ code, setCode }), [code]);

  return <UserCodeContext.Provider value={value}>{children}</UserCodeContext.Provider>;
};

export const useUserCode = () => {
  const ctx = useContext(UserCodeContext);
  if (!ctx) {
    throw new Error('useUserCode must be used within a UserCodeProvider');
  }
  return ctx;
};


