'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

export default function AuthCard({ initialTab = 'login', redirectTo = '/' }) {
  // isFlipped: true = mostrar Registro, false = mostrar Login
  const [isFlipped, setIsFlipped] = useState(initialTab === 'signup');

  // Actualizar estado si cambia initialTab
  useEffect(() => {
    setIsFlipped(initialTab === 'signup');
  }, [initialTab]);

  const flipCard = () => setIsFlipped(!isFlipped);

  return (
    <div className="w-full max-w-md mx-auto perspective">
      <motion.div
        className="relative w-full h-[650px] [transform-style:preserve-3d] transition-transform duration-700 ease-in-out"
        initial={false} // No animar en la carga inicial
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
      >
        {/* Lado Frontal (Login) */}
        <motion.div
          className="absolute w-full h-full [backface-visibility:hidden] flex flex-col justify-center p-4 md:p-8"
        >
          <LoginForm redirectTo={redirectTo} />
          <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
            ¿No tienes cuenta?{' '}
            <button onClick={flipCard} className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 underline ml-1">
              Regístrate
            </button>
          </p>
        </motion.div>

        {/* Lado Trasero (Registro) */}
        <motion.div
          className="absolute w-full h-full [backface-visibility:hidden] flex flex-col justify-center p-4 md:p-8"
          style={{ rotateY: 180 }} // Mantener este lado rotado inicialmente
        >
          <RegisterForm redirectTo={redirectTo} />
           <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
             ¿Ya tienes cuenta?{' '}
             <button onClick={flipCard} className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 underline ml-1">
               Inicia sesión
             </button>
           </p>
        </motion.div>
      </motion.div>
    </div>
  );
} 