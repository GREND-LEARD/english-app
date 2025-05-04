'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

export default function ThemeToggleButton() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme(); // resolvedTheme nos dice si 'system' es light o dark

  // useEffect solo se ejecuta en el cliente, así evitamos errores de hidratación
  useEffect(() => {
    setMounted(true);
  }, []);

  // Determinar el tema efectivo actual (considerando 'system')
  const currentTheme = theme === 'system' ? resolvedTheme : theme;

  // No renderizar nada hasta que el componente esté montado en el cliente
  if (!mounted) {
    // Renderizar un placeholder o nada para evitar mismatch de hidratación
    return <div className="w-10 h-10"></div>; // Placeholder del mismo tamaño
  }

  return (
    <button
      aria-label="Toggle Dark Mode"
      type="button"
      className="w-10 h-10 p-2 rounded-full transition-colors duration-200 
                 bg-gray-200 dark:bg-gray-700 
                 hover:bg-gray-300 dark:hover:bg-gray-600
                 text-gray-800 dark:text-gray-200"
      onClick={() => setTheme(currentTheme === 'dark' ? 'light' : 'dark')} // Cambia entre light y dark
    >
      {currentTheme === 'dark' ? (
        // Icono Sol
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5h2.25a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6.166 7.758a.75.75 0 00-1.06 1.061l1.59 1.59a.75.75 0 001.061-1.06l-1.59-1.591zM12 3.75a.75.75 0 01.75.75v.008a.75.75 0 01-1.5 0V4.5a.75.75 0 01.75-.75z" />
        </svg>
      ) : (
        // Icono Luna
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-3.469 1.698-6.608 4.43-8.566a.75.75 0 01.819.162z" clipRule="evenodd" />
        </svg>
      )}
    </button>
  );
} 