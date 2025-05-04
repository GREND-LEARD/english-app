'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(true);
  
  // Verificar tema inicial al cargar la página
  useEffect(() => {
    // Por defecto usar tema oscuro
    setIsDark(true);
    document.documentElement.classList.add('dark-theme');
    document.documentElement.classList.remove('light-theme');
  }, []);
  
  const toggleTheme = () => {
    setIsDark(!isDark);
    
    if (isDark) {
      document.documentElement.classList.remove('dark-theme');
      document.documentElement.classList.add('light-theme');
    } else {
      document.documentElement.classList.add('dark-theme');
      document.documentElement.classList.remove('light-theme');
    }
  };
  
  return (
    <div className="fixed top-4 right-4 z-50">
      <motion.button
        onClick={toggleTheme}
        className="bg-slate-800/70 dark:bg-slate-200/20 backdrop-blur-sm p-2 rounded-full shadow-lg border border-slate-700 dark:border-slate-500"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 10 }}
      >
        <motion.div
          animate={{
            rotate: isDark ? 0 : 180,
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 0.5 }}
        >
          {isDark ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-300">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          )}
        </motion.div>
      </motion.button>
    </div>
  );
};

export default ThemeToggle; 