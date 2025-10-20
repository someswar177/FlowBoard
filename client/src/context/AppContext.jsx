import { createContext, useContext, useState, useCallback } from 'react';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [toast, setToast] = useState(null);

  // stable function to show toast
  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
  }, []);

  const value = {
    projects,
    setProjects,
    toast,
    showToast,
    setToast,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};