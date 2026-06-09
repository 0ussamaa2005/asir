import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [lang, setLang] = useState('en');
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Sync the root HTML tags so HTML layout flow updates automatically
  useEffect(() => {
    // 1. Handle Language Orientation (LTR vs RTL)
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    // 2. Handle Tailwind Dark Mode Class Hooks
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleLang = () => setLang((prev) => (prev === 'en' ? 'ar' : 'en'));
  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  return (
    <AppContext.Provider value={{ lang, setLang, toggleLang, isDarkMode, toggleTheme }}>
      <div className={isDarkMode ? 'dark bg-[#0b1120] text-slate-100 min-h-screen transition-colors duration-300' : 'bg-slate-50 text-slate-900 min-h-screen transition-colors duration-300'}>
        {children}
      </div>
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);